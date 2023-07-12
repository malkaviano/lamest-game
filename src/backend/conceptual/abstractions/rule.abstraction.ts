import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { LoggerInterface } from '@interfaces/logger.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleInterface } from '@interfaces/rule.interface';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { UsableDefinition } from '@definitions/usable.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { ActorDodgedInterface } from '@interfaces/actor-dodged.interface';
import { ReadableInterface } from '@interfaces/readable.interface';
import { DocumentOpenedInterface } from '@interfaces/document-opened.interface';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { ReactionValuesInterface } from '@interfaces/reaction-values.interface';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActorEntity } from '@entities/actor.entity';

type Result = {
  name: RuleNameLiteral;
  event: ActionableEvent;
  result: RuleResultLiteral;
  actor: ActorInterface;
  target?: InteractiveInterface;
  picked?: GameItemDefinition;
  used?: UsableDefinition;
  read?: ReadableDefinition;
  equipped?: WeaponDefinition;
  unequipped?: WeaponDefinition;
  affected?: WeaponDefinition;
  skillName?: string;
  roll?: {
    checkRoll?: number;
    result: CheckResultLiteral;
  };
  consumable?: {
    consumed: ConsumableDefinition;
    hp: number;
    energy: number;
  };
  dodged?: boolean;
  effect?: { type: EffectTypeLiteral; amount: number };
};

export abstract class RuleAbstraction
  implements
    RuleInterface,
    LoggerInterface,
    ActorDodgedInterface,
    DocumentOpenedInterface
{
  protected ruleResult: {
    target?: InteractiveInterface;
    picked?: GameItemDefinition;
    used?: UsableDefinition;
    read?: ReadableDefinition;
    equipped?: WeaponDefinition;
    unequipped?: WeaponDefinition;
    affected?: WeaponDefinition;
    skillName?: string;
    roll?: {
      checkRoll?: number;
      result: CheckResultLiteral;
    };
    consumable?: ConsumableDefinition;
    consumableHp?: number;
    consumableEnergy?: number;
    dodged?: boolean;
    effectType?: EffectTypeLiteral;
    effectAmount?: number;
  };

  protected readonly ruleLog: Subject<LogMessageDefinition>;

  protected readonly actorDodged: Subject<string>;

  public readonly actorDodged$: Observable<string>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  protected readonly documentOpened: Subject<ReadableInterface>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  public abstract get name(): RuleNameLiteral;

  constructor() {
    this.ruleLog = new Subject();

    this.logMessageProduced$ = this.ruleLog.asObservable();

    this.actorDodged = new Subject();

    this.actorDodged$ = this.actorDodged.asObservable();

    this.documentOpened = new Subject();

    this.documentOpened$ = this.documentOpened.asObservable();

    this.ruleResult = {};
  }

  public abstract execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface;

  protected getResult(
    event: ActionableEvent,
    actor: ActorInterface,
    result: RuleResultLiteral
  ): RuleResultInterface {
    const r: Result = {
      name: this.name,
      event,
      actor,
      result,
    };

    this.setTarget(r);

    this.setPicked(r);

    this.setUsed(r);

    this.setRead(r);

    this.setEquipped(r);

    this.setUnequipped(r);

    this.setAffected(r);

    this.setDodged(r);

    this.setSkill(r);

    this.setConsumable(r);

    this.setEffect(r);

    return r;
  }

  protected affectWith(
    target: InteractiveInterface,
    action: ActionableDefinition,
    rollResult: CheckResultLiteral,
    values: ReactionValuesInterface
  ): void {
    const log = target.reactTo(action, rollResult, values);

    if (log) {
      const logMessage = GameStringsStore.createFreeLogMessage(
        'AFFECTED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);

      if (
        target &&
        target instanceof ActorEntity &&
        target.situation === 'DEAD'
      ) {
        this.ruleLog.next(
          GameStringsStore.createActorIsDeadLogMessage(target.name)
        );
      }
    }
  }

  private setEffect(r: Result) {
    if (this.ruleResult.effectAmount && this.ruleResult.effectType) {
      r.effect = {
        type: this.ruleResult.effectType,
        amount: this.ruleResult.effectAmount,
      };
    }
  }

  private setConsumable(r: Result) {
    if (
      this.ruleResult.consumable &&
      this.ruleResult.consumableHp &&
      this.ruleResult.consumableEnergy
    ) {
      r.consumable = {
        consumed: this.ruleResult.consumable,
        hp: this.ruleResult.consumableHp,
        energy: this.ruleResult.consumableEnergy,
      };
    }
  }

  private setSkill(r: Result) {
    if (this.ruleResult.skillName) {
      r.skillName = this.ruleResult.skillName;

      if (this.ruleResult.roll?.checkRoll) {
        r.roll = {
          checkRoll: this.ruleResult.roll.checkRoll,
          result: this.ruleResult.roll.result,
        };
      }
    }
  }

  private setDodged(r: Result) {
    if (this.ruleResult.dodged !== undefined) {
      r.dodged = this.ruleResult.dodged;
    }
  }

  private setAffected(r: Result) {
    if (this.ruleResult.affected) {
      r.affected = this.ruleResult.affected;
    }
  }

  private setUnequipped(r: Result) {
    if (this.ruleResult.unequipped) {
      r.unequipped = this.ruleResult.unequipped;
    }
  }

  private setEquipped(r: Result) {
    if (this.ruleResult.equipped) {
      r.equipped = this.ruleResult.equipped;
    }
  }

  private setRead(r: Result) {
    if (this.ruleResult.read) {
      r.read = this.ruleResult.read;
    }
  }

  private setUsed(r: Result) {
    if (this.ruleResult.used) {
      r.used = this.ruleResult.used;
    }
  }

  private setPicked(r: Result) {
    if (this.ruleResult.picked) {
      r.picked = this.ruleResult.picked;
    }
  }

  private setTarget(r: Result) {
    if (this.ruleResult.target) {
      r.target = this.ruleResult.target;
    }
  }
}

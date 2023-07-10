import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActorInterface } from '@conceptual/interfaces/actor.interface';
import { LoggerInterface } from '@conceptual/interfaces/logger.interface';
import { RuleExtrasInterface } from '@conceptual/interfaces/rule-extras.interface';
import { RuleInterface } from '@conceptual/interfaces/rule.interface';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { RuleResultLiteral } from '@conceptual/literals/rule-result.literal';
import { RuleNameLiteral } from '@conceptual/literals/rule-name.literal';
import { InteractiveInterface } from '@conceptual/interfaces/interactive.interface';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { UsableDefinition } from '@definitions/usable.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { EffectTypeLiteral } from '@conceptual/literals/effect-type.literal';

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
  skill?: {
    name: string;
    roll?: number;
  };
  consumable?: {
    consumed: ConsumableDefinition;
    hp: number;
    energy: number;
  };
  dodged?: boolean;
  effect?: { type: EffectTypeLiteral; amount: number };
};

export abstract class MasterRule implements RuleInterface, LoggerInterface {
  protected ruleResult: {
    target?: InteractiveInterface;
    picked?: GameItemDefinition;
    used?: UsableDefinition;
    read?: ReadableDefinition;
    equipped?: WeaponDefinition;
    unequipped?: WeaponDefinition;
    affected?: WeaponDefinition;
    skillName?: string;
    checkRoll?: number;
    consumable?: ConsumableDefinition;
    consumableHp?: number;
    consumableEnergy?: number;
    dodged?: boolean;
    effectType?: EffectTypeLiteral;
    effectAmount?: number;
  };

  protected readonly ruleLog: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public abstract get name(): RuleNameLiteral;

  constructor() {
    this.ruleLog = new Subject();

    this.logMessageProduced$ = this.ruleLog.asObservable();

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
      if (this.ruleResult.checkRoll) {
        r.skill = {
          name: this.ruleResult.skillName,
          roll: this.ruleResult.checkRoll,
        };
      } else {
        r.skill = { name: this.ruleResult.skillName };
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

import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { LoggerInterface } from '@interfaces/logger.interface';
import { RuleValuesDefinition } from '@definitions/rule-values.definition';
import { RuleInterface } from '@interfaces/rule.interface';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResult, RuleResultPayload } from '@results/rule.result';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { ActorDodgedInterface } from '@interfaces/actor-dodged.interface';
import { ReadableDefinition } from '@definitions/readable.definition';
import { DocumentOpenedInterface } from '@interfaces/document-opened.interface';
import {
  ActionableDefinition,
  consumeActionable,
} from '@definitions/actionable.definition';
import { ReactionValuesDefinition } from '@definitions/reaction-values.definition';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActorEntity } from '@entities/actor.entity';
import { Mutable } from '@wrappers/mutable.wrapper';

export abstract class RuleAbstraction
  implements
    RuleInterface,
    LoggerInterface,
    ActorDodgedInterface,
    DocumentOpenedInterface
{
  protected ruleResult: Mutable<RuleResultPayload>;

  protected readonly ruleLog: Subject<LogMessageDefinition>;

  protected readonly actorDodged: Subject<string>;

  public readonly actorDodged$: Observable<string>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  protected readonly documentOpened: Subject<ReadableDefinition>;

  public readonly documentOpened$: Observable<ReadableDefinition>;

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
    extras: RuleValuesDefinition
  ): RuleResult;

  protected getResult(
    event: ActionableEvent,
    actor: ActorInterface,
    result: RuleResultLiteral
  ): RuleResult {
    const r: Mutable<RuleResult> = {
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

    this.setArmor(r);

    return r;
  }

  protected affectWith(
    target: InteractiveInterface,
    action: ActionableDefinition,
    rollResult: CheckResultLiteral,
    values: ReactionValuesDefinition
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

  protected activation(
    actor: ActorInterface,
    energyActivation: number,
    label: string
  ): void {
    const log = actor.reactTo(consumeActionable, 'NONE', {
      energy: -energyActivation,
    });

    if (log) {
      const logMessage = GameStringsStore.createEnergySpentLogMessage(
        actor.name,
        log,
        label
      );

      this.ruleLog.next(logMessage);
    }
  }

  private setEffect(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.effect?.amount && this.ruleResult.effect.type) {
      r.effect = {
        type: this.ruleResult.effect.type,
        amount: this.ruleResult.effect.amount,
      };
    }
  }

  private setConsumable(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.consumable?.hp || this.ruleResult.consumable?.energy) {
      r.consumable = this.ruleResult.consumable;
    }
  }

  private setSkill(r: Mutable<RuleResultPayload>) {
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

  private setDodged(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.dodged !== undefined) {
      r.dodged = this.ruleResult.dodged;
    }
  }

  private setAffected(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.affected) {
      r.affected = this.ruleResult.affected;
    }
  }

  private setUnequipped(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.unequipped) {
      r.unequipped = this.ruleResult.unequipped;
    }
  }

  private setEquipped(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.equipped) {
      r.equipped = this.ruleResult.equipped;
    }
  }

  private setRead(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.read) {
      r.read = this.ruleResult.read;
    }
  }

  private setUsed(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.used) {
      r.used = this.ruleResult.used;
    }
  }

  private setPicked(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.picked) {
      r.picked = this.ruleResult.picked;
    }
  }

  private setTarget(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.target) {
      r.target = this.ruleResult.target;
    }
  }

  private setArmor(r: Mutable<RuleResultPayload>) {
    if (this.ruleResult.strip) {
      r.strip = this.ruleResult.strip;
    }

    if (this.ruleResult.wearing) {
      r.wearing = this.ruleResult.wearing;
    }
  }
}

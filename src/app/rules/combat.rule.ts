import { Injectable } from '@angular/core';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import {
  createFreeLogMessage,
  createUsedItemLogMessage,
  LogMessageDefinition,
  createCheckLogMessage,
  createCannotCheckLogMessage,
  createUnDodgeableAttackLogMessage,
  createLostLogMessage,
  createOutOfDodgesLogMessage,
  createNotEnoughEnergyLogMessage,
  createEnergySpentLogMessage,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { DamageDefinition } from '../definitions/damage.definition';
import { EffectEvent } from '../events/effect.event';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ActorEntity } from '../entities/actor.entity';

@Injectable({
  providedIn: 'root',
})
export class CombatRule implements RuleInterface {
  public readonly activationAction: ActionableDefinition;

  constructor(
    private readonly rollRule: RollService,
    private readonly extractorHelper: ExtractorHelper
  ) {
    this.activationAction = createActionableDefinition('CONSUME', '', '');
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const logs: LogMessageDefinition[] = [];

    let dodged = false;

    const {
      dodgeable,
      damage,
      skillName,
      identity,
      usability,
      energyActivation,
    } = actor.weaponEquipped;

    if (actor.derivedAttributes.EP.value >= energyActivation) {
      this.activateItem(energyActivation, actor, identity.label, logs);

      const targetWasHit = this.checkSkill(
        actor,
        skillName,
        target,
        identity.label,
        logs
      );

      if (usability === 'DISPOSABLE') {
        this.disposeItem(actor, identity.label, logs);
      }

      if (targetWasHit) {
        dodged = this.tryDodge(target, dodgeable, extras, logs);

        if (!dodged) {
          this.applyDamage(target, action.actionableDefinition, damage, logs);
        }
      }
    } else {
      logs.push(createNotEnoughEnergyLogMessage(actor.name, identity.label));
    }

    return { logs, dodged };
  }

  private disposeItem(
    actor: ActorInterface,
    label: string,
    logs: LogMessageDefinition[]
  ): void {
    actor.unEquip();

    logs.push(createLostLogMessage(actor.name, label));
  }

  private activateItem(
    energyActivation: number,
    actor: ActorInterface,
    label: string,
    logs: LogMessageDefinition[]
  ) {
    if (energyActivation) {
      const energySpentLog = actor.reactTo(this.activationAction, 'NONE', {
        energy: -energyActivation,
      });

      if (energySpentLog) {
        logs.push(
          createEnergySpentLogMessage(actor.name, energySpentLog, label)
        );
      }
    }
  }

  private checkSkill(
    actor: ActorInterface,
    skillName: string,
    target: ActionReactiveInterface,
    weaponLabel: string,
    logs: LogMessageDefinition[]
  ): boolean {
    let targetWasHit = true;

    const targetActor = this.asActor(target);

    if (targetActor) {
      const { result: actorResult, roll: actorRoll } =
        this.rollRule.actorSkillCheck(actor, skillName);

      logs.push(
        createUsedItemLogMessage(actor.name, targetActor.name, weaponLabel)
      );

      logs.push(
        createCheckLogMessage(actor.name, skillName, actorRoll, actorResult)
      );

      targetWasHit = actorResult === 'SUCCESS';
    }

    return targetWasHit;
  }

  private tryDodge(
    target: ActionReactiveInterface,
    dodgeable: boolean,
    extras: RuleExtrasInterface,
    logs: LogMessageDefinition[]
  ): boolean {
    let dodged = false;

    const targetActor = this.asActor(target);

    if (targetActor) {
      if (dodgeable) {
        dodged = this.checkDodged(
          targetActor,
          extras.targetDodgesPerformed ?? 0,
          logs
        );
      } else {
        logs.push(createUnDodgeableAttackLogMessage(target.name));
      }
    }

    return dodged;
  }

  private checkDodged(
    targetActor: ActorInterface,
    dodgesPerformed: number,
    logs: LogMessageDefinition[]
  ) {
    const maxDodges = targetActor.dodgesPerRound;

    const { result: dodgeResult, roll: dodgeRoll } =
      this.rollRule.actorSkillCheck(targetActor, 'Dodge');

    let dodged = dodgeResult === 'SUCCESS';

    if (dodgeResult === 'IMPOSSIBLE') {
      logs.push(createCannotCheckLogMessage(targetActor.name, 'Dodge'));
    } else if (dodgesPerformed < maxDodges) {
      logs.push(
        createCheckLogMessage(targetActor.name, 'Dodge', dodgeRoll, dodgeResult)
      );
    } else {
      dodged = false;

      logs.push(createOutOfDodgesLogMessage(targetActor.name));
    }

    return dodged;
  }

  private applyDamage(
    target: ActionReactiveInterface,
    action: ActionableDefinition,
    damage: DamageDefinition,
    logs: LogMessageDefinition[]
  ): void {
    const damageAmount = this.rollRule.roll(damage.diceRoll) + damage.fixed;

    const log = target.reactTo(action, 'SUCCESS', {
      effect: new EffectEvent(damage.effectType, damageAmount),
    });

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }
  }

  private asActor(target: ActionReactiveInterface): ActorInterface | null {
    if (
      target instanceof ActorEntity &&
      ['ACTOR', 'PLAYER'].includes(target.classification)
    ) {
      return target;
    }

    return null;
  }
}

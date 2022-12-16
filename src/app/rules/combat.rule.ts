import { Injectable } from '@angular/core';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import {
  createFreeLogMessage,
  createAttackedLogMessage,
  LogMessageDefinition,
  createCheckLogMessage,
  createCannotCheckLogMessage,
  createUnDodgeableAttackLogMessage,
  createLostLogMessage,
  createOutOfDodgesLogMessage,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { DamageDefinition } from '../definitions/damage.definition';
import { EffectReceivedDefinition } from '../definitions/effect-received.definition';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor-target.helper';

@Injectable({
  providedIn: 'root',
})
export class CombatRule implements RuleInterface {
  constructor(
    private readonly rollRule: RollService,
    private readonly withTarget: ExtractorHelper
  ) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.withTarget.extractRuleTarget(extras);

    const logs: LogMessageDefinition[] = [];

    let targetHit = true;

    const { dodgeable, damage, skillName, identity, usability } =
      actor.weaponEquipped;

    if (['ACTOR', 'PLAYER'].includes(target.classification)) {
      const targetActor = target as ActorInterface;

      const { result: actorResult, roll: actorRoll } =
        this.rollRule.actorSkillCheck(actor, skillName);

      logs.push(
        createAttackedLogMessage(actor.name, targetActor.name, identity.label)
      );

      logs.push(
        createCheckLogMessage(actor.name, skillName, actorRoll, actorResult)
      );

      targetHit = actorResult === 'SUCCESS';

      if (targetHit) {
        if (dodgeable) {
          targetHit = this.checkIfHit(
            targetActor,
            logs,
            extras.targetDodgesPerformed ?? 0
          );
        } else {
          logs.push(createUnDodgeableAttackLogMessage(targetActor.name));
        }
      }
    }

    if (usability === 'DISPOSABLE') {
      actor.unEquip();

      logs.push(createLostLogMessage(actor.name, identity.label));
    }

    if (targetHit) {
      this.applyDamage(action.actionableDefinition, damage, target, logs);
    }

    return { logs };
  }

  private checkIfHit(
    targetActor: ActorInterface,
    logs: LogMessageDefinition[],
    dodgesPerformed: number
  ) {
    const maxDodges = targetActor.dodgesPerRound;

    const { result: dodgeResult, roll: dodgeRoll } =
      this.rollRule.actorSkillCheck(targetActor, 'Dodge');

    let hit = dodgeResult !== 'SUCCESS';

    if (dodgeResult === 'IMPOSSIBLE') {
      logs.push(createCannotCheckLogMessage(targetActor.name, 'Dodge'));
    } else if (dodgesPerformed < maxDodges) {
      logs.push(
        createCheckLogMessage(targetActor.name, 'Dodge', dodgeRoll, dodgeResult)
      );
    } else {
      hit = true;

      logs.push(createOutOfDodgesLogMessage(targetActor.name));
    }

    return hit;
  }

  private applyDamage(
    action: ActionableDefinition,
    damage: DamageDefinition,
    target: ActionReactiveInterface,
    logs: LogMessageDefinition[]
  ) {
    const damageAmount = this.rollRule.roll(damage.diceRoll) + damage.fixed;

    const log = target.reactTo(action, 'SUCCESS', {
      effect: new EffectReceivedDefinition(damage.effectType, damageAmount),
    });

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }
  }
}

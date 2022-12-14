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
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactive } from '../interfaces/action-reactive.interface';
import { DamageDefinition } from '../definitions/damage.definition';

@Injectable({
  providedIn: 'root',
})
export class CombatRule implements RuleInterface {
  constructor(private readonly rollRule: RollService) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    target: ActionReactive
  ): RuleResultInterface {
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
          const { result: dodgeResult, roll: dodgeRoll } =
            this.rollRule.actorSkillCheck(targetActor, 'Dodge');

          targetHit = dodgeResult !== 'SUCCESS';

          if (dodgeResult === 'IMPOSSIBLE') {
            logs.push(createCannotCheckLogMessage(targetActor.name, 'Dodge'));
          } else {
            logs.push(
              createCheckLogMessage(
                targetActor.name,
                'Dodge',
                dodgeRoll,
                dodgeResult
              )
            );
          }
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
      this.applyDamage(damage, target, logs);
    }

    return { logs };
  }

  private applyDamage(
    damage: DamageDefinition,
    target: ActionReactive,
    logs: LogMessageDefinition[]
  ) {
    const damageAmount = this.rollRule.roll(damage.diceRoll) + damage.fixed;

    const log = target.reactTo(
      createActionableDefinition('ATTACK', 'attack', 'Attack'),
      'SUCCESS',
      { damage: damageAmount }
    );

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }
  }
}

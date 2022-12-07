import { Injectable } from '@angular/core';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import {
  createFreeLogMessage,
  createAttackedLogMessage,
  LogMessageDefinition,
  createCheckLogMessage,
  createCannotCheckLogMessage,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactive } from '../interfaces/action-reactive.interface';

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

    const { dodgeable, damage, skillName, label } = actor.weaponEquipped;

    if (target.classification === 'ACTOR') {
      const targetActor = target as ActorInterface;

      const { result: enemyResult, roll: enemyRoll } =
        this.rollRule.actorSkillCheck(actor, skillName);

      logs.push(createAttackedLogMessage(actor.name, targetActor.name, label));

      logs.push(
        createCheckLogMessage(actor.name, skillName, enemyRoll, enemyResult)
      );

      targetHit = enemyResult === 'SUCCESS';

      if (targetHit) {
        if (dodgeable) {
          const { result: dodgeResult, roll: dodgeRoll } =
            this.rollRule.actorSkillCheck(targetActor, 'Dodge');

          targetHit = dodgeResult !== 'SUCCESS';

          switch (dodgeResult) {
            case 'IMPOSSIBLE':
              logs.push(createCannotCheckLogMessage(targetActor.name, 'Dodge'));
              break;
            default:
              logs.push(
                createCheckLogMessage(
                  targetActor.name,
                  'Dodge',
                  dodgeRoll,
                  dodgeResult
                )
              );
              break;
          }
        } else {
          createFreeLogMessage(targetActor.name, 'Attack is not dodgeable');
        }
      }
    }

    if (targetHit) {
      const damageAmount = this.rollRule.roll(damage.diceRoll) + damage.fixed;

      const log = target.reactTo(
        createActionableDefinition('ATTACK', 'attack', 'Attack'),
        'SUCCESS',
        damageAmount
      );

      if (log) {
        logs.push(createFreeLogMessage(target.name, log));
      }
    }

    return { logs };
  }
}

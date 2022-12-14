import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactive } from '../interfaces/action-reactive.interface';

@Injectable({
  providedIn: 'root',
})
export class SkillRule implements RuleInterface {
  constructor(private readonly rollRule: RollService) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    target: ActionReactive
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const skillName = action.actionableDefinition.name;

    const { roll, result } = this.rollRule.actorSkillCheck(actor, skillName);

    if (result !== 'IMPOSSIBLE') {
      logs.push(createCheckLogMessage(actor.name, skillName, roll, result));

      const log = target.reactTo(action.actionableDefinition, result, {});

      if (log) {
        logs.push(createFreeLogMessage(target.name, log));
      }
    } else {
      logs.push(createCannotCheckLogMessage(actor.name, skillName));
    }

    return { logs };
  }
}

import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import {
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactive } from '../interfaces/action-reactive.interface';

@Injectable({
  providedIn: 'root',
})
export class ConversationRule implements RuleInterface {
  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    target: ActionReactive
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition } = action;

    const log = target.reactTo(actionableDefinition, 'NONE');

    logs.push(createFreeLogMessage(actor.name, actionableDefinition.label));

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }

    return { logs };
  }
}

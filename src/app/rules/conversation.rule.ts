import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { NarrativeService } from '../services/narrative.service';
import {
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class ConversationRule implements RuleInterface {
  constructor(private readonly narrativeService: NarrativeService) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition, eventId } = action;

    const interactive = this.narrativeService.interatives[eventId];

    const log = interactive.reactTo(actionableDefinition, 'NONE');

    logs.push(createFreeLogMessage('player', actionableDefinition.label));

    if (log) {
      logs.push(createFreeLogMessage(interactive.name, log));
    }

    return { logs };
  }
}

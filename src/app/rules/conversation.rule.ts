import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { NarrativeService } from '../services/narrative.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationRule implements RuleInterface {
  constructor(private readonly narrativeService: NarrativeService) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: string[] = [];

    const { actionableDefinition, eventId } = action;

    const interactive = this.narrativeService.interatives[eventId];

    const log = interactive.actionSelected(actionableDefinition, 'NONE');

    logs.push(`player: ${actionableDefinition.label}`);

    if (log) {
      logs.push(`${interactive.name}: ${log}`);
    }

    return { logs };
  }
}

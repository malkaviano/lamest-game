import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationRule implements RuleInterface {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const { actionableDefinition, eventId } = action;

    const interactive = this.narrativeService.interatives[eventId];

    const log = interactive.actionSelected(actionableDefinition, 'NONE');

    this.loggingService.log(`player: ${actionableDefinition.label}`);

    if (log) {
      this.loggingService.log(`${interactive.name}: ${log}`);
    }
  }
}

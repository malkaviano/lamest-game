import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';

@Injectable({
  providedIn: 'root',
})
export class SceneRule implements RuleInterface {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const interactive = this.narrativeService.interatives[action.eventId];

    this.narrativeService.changeScene(action);

    this.loggingService.log(
      `selected: ${interactive.name} -> ${action.actionableDefinition.label}`
    );
  }
}

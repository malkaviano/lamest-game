import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';

@Injectable({
  providedIn: 'root',
})
export class SceneRule {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const interactive = this.narrativeService.run(action, 'NONE');

    this.loggingService.log(
      `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
    );
  }
}

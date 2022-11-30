import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { NarrativeService } from '../services/narrative.service';
import {
  createSceneLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class SceneRule implements RuleInterface {
  constructor(private readonly narrativeService: NarrativeService) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const interactive = this.narrativeService.interatives[action.eventId];

    this.narrativeService.changeScene(action);

    logs.push(
      createSceneLogMessage(
        'player',
        interactive.name,
        action.actionableDefinition.label
      )
    );

    return { logs };
  }
}

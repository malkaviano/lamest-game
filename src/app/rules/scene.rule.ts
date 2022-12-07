import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { NarrativeService } from '../services/narrative.service';
import {
  createSceneLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactive } from '../interfaces/action-reactive.interface';

@Injectable({
  providedIn: 'root',
})
export class SceneRule implements RuleInterface {
  constructor(private readonly narrativeService: NarrativeService) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    target: ActionReactive
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    this.narrativeService.changeScene(action);

    logs.push(
      createSceneLogMessage(
        actor.name,
        target.name,
        action.actionableDefinition.label
      )
    );

    return { logs };
  }
}

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
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor-target.helper';

@Injectable({
  providedIn: 'root',
})
export class SceneRule implements RuleInterface {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly extractorHelper: ExtractorHelper
  ) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

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

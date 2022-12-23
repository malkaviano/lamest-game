import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { NarrativeService } from '../services/narrative.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { MasterRuleService } from './master.rule';
import { GameMessagesStoreService } from '../stores/game-messages.store';

@Injectable({
  providedIn: 'root',
})
export class SceneRule extends MasterRuleService {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly extractorHelper: ExtractorHelper
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    this.narrativeService.changeScene(action);

    const logMessage = GameMessagesStoreService.createSceneLogMessage(
      actor.name,
      target.name,
      action.actionableDefinition.label
    );

    this.ruleLog.next(logMessage);
  }
}

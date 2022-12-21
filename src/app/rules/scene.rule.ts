import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { NarrativeService } from '../services/narrative.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class SceneRule extends MasterRuleService {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    this.narrativeService.changeScene(action);

    const logMessage = this.stringMessagesStoreService.createSceneLogMessage(
      actor.name,
      target.name,
      action.actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    return {};
  }
}

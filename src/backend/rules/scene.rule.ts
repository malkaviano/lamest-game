import { Injectable } from '@angular/core';

import { NarrativeService } from '../services/narrative.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class SceneRule extends MasterRuleService {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly checkedHelper: CheckedHelper
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedHelper.getRuleTargetOrThrow(extras);

    this.narrativeService.changeScene(action);

    const logMessage = GameStringsStore.createSceneLogMessage(
      actor.name,
      target.name,
      action.actionableDefinition.label
    );

    this.ruleLog.next(logMessage);
  }
}

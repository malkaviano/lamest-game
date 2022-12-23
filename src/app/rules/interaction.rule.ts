import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { MasterRuleService } from './master.rule';
import { GameMessagesStoreService } from '../stores/game-messages.store';

@Injectable({
  providedIn: 'root',
})
export class InteractionRule extends MasterRuleService {
  constructor(private readonly extractorHelper: ExtractorHelper) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const { actionableDefinition } = action;

    const logMessage = GameMessagesStoreService.createFreeLogMessage(
      'INTERACTED',
      actor.name,
      actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    const log = target.reactTo(actionableDefinition, 'NONE', {});

    if (log) {
      const logMessage = GameMessagesStoreService.createFreeLogMessage(
        'INTERACTED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);
    }
  }
}

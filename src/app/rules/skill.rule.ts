import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { MasterRuleService } from './master.rule.service';
import { GameMessagesStoreService } from '../stores/game-messages.store';

@Injectable({
  providedIn: 'root',
})
export class SkillRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly extractorHelper: ExtractorHelper
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const skillName = event.actionableDefinition.name;

    const { roll, result } = this.rollService.actorSkillCheck(actor, skillName);

    if (result !== 'IMPOSSIBLE') {
      const logMessage = GameMessagesStoreService.createSkillCheckLogMessage(
        actor.name,
        skillName,
        roll.toString(),
        result
      );

      this.ruleLog.next(logMessage);

      const log = target.reactTo(event.actionableDefinition, result, {
        actorVisibility: actor,
        target,
      });

      if (log) {
        const logMessage = GameMessagesStoreService.createFreeLogMessage(
          'CHECK',
          target.name,
          log
        );

        this.ruleLog.next(logMessage);
      }
    } else {
      const logMessage =
        GameMessagesStoreService.createCannotCheckSkillLogMessage(
          actor.name,
          skillName
        );

      this.ruleLog.next(logMessage);
    }
  }
}

import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule extends MasterRuleService {
  constructor(
    private readonly rollRule: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const skillName = event.actionableDefinition.name;

    const { roll, result } = this.rollRule.actorSkillCheck(actor, skillName);

    if (result !== 'IMPOSSIBLE') {
      const logMessage =
        this.stringMessagesStoreService.createSkillCheckLogMessage(
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
        const logMessage = this.stringMessagesStoreService.createFreeLogMessage(
          'CHECK',
          target.name,
          log
        );

        this.ruleLog.next(logMessage);
      }
    } else {
      const logMessage =
        this.stringMessagesStoreService.createCannotCheckSkillLogMessage(
          actor.name,
          skillName
        );

      this.ruleLog.next(logMessage);
    }

    return {};
  }
}

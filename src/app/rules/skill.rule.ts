import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule implements RuleInterface {
  constructor(
    private readonly rollRule: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {}

  public execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const logs: LogMessageDefinition[] = [];

    const skillName = event.actionableDefinition.name;

    const { roll, result } = this.rollRule.actorSkillCheck(actor, skillName);

    if (result !== 'IMPOSSIBLE') {
      logs.push(
        this.stringMessagesStoreService.createSkillCheckLogMessage(
          actor.name,
          skillName,
          roll.toString(),
          result
        )
      );

      const log = target.reactTo(event.actionableDefinition, result, {
        actorVisibility: actor,
        target,
      });

      if (log) {
        logs.push(
          this.stringMessagesStoreService.createFreeLogMessage(
            'CHECK',
            target.name,
            log
          )
        );
      }
    } else {
      logs.push(
        this.stringMessagesStoreService.createCannotCheckSkillLogMessage(
          actor.name,
          skillName
        )
      );
    }

    return { logs };
  }
}

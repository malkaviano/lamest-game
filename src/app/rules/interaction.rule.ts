import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionRule implements RuleInterface {
  constructor(
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition } = action;

    const log = target.reactTo(actionableDefinition, 'NONE', {});

    logs.push(
      this.stringMessagesStoreService.createFreeLogMessage(
        'INSPECTED',
        actor.name,
        actionableDefinition.label
      )
    );

    if (log) {
      logs.push(
        this.stringMessagesStoreService.createFreeLogMessage(
          'INSPECTED',
          target.name,
          log
        )
      );
    }

    return { logs };
  }
}

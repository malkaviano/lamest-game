import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionRule extends MasterRuleService {
  constructor(
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

    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition } = action;

    const log = target.reactTo(actionableDefinition, 'NONE', {});

    const logMessage = this.stringMessagesStoreService.createFreeLogMessage(
      'INSPECTED',
      actor.name,
      actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    logs.push(logMessage);

    if (log) {
      const logMessage = this.stringMessagesStoreService.createFreeLogMessage(
        'INSPECTED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);

      logs.push(logMessage);
    }

    return { logs };
  }
}

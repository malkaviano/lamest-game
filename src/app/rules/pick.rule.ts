import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';

import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class PickRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
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

    const item = this.extractorHelper.extractItemOrThrow(
      this.inventoryService,
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store(actor.id, item);

    const log = target.reactTo(action.actionableDefinition, 'NONE', {});

    if (log) {
      const logMessage = this.stringMessagesStoreService.createTookLogMessage(
        actor.name,
        target.name,
        log
      );

      this.ruleLog.next(logMessage);
    }

    return {};
  }
}

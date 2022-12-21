import { Injectable } from '@angular/core';

import { errorMessages } from '../definitions/error-messages.definition';
import { ReadableDefinition } from '../definitions/readable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class InspectRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const itemName = event.eventId;

    const item = this.inventoryService.look<ReadableDefinition>(
      actor.id,
      itemName
    );

    if (!item) {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    const logMessage =
      this.stringMessagesStoreService.createItemInspectedLogMessage(
        actor.name,
        item.identity.label
      );

    this.ruleLog.next(logMessage);

    return {
      logs: [logMessage],
      documentOpened: {
        title: item.title,
        text: item.text,
      },
    };
  }
}

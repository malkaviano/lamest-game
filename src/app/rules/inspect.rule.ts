import { Injectable } from '@angular/core';

import { errorMessages } from '../definitions/error-messages.definition';
import { ReadableDefinition } from '../definitions/readable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { RuleInterface } from '../interfaces/rule.interface';
import { InventoryService } from '../services/inventory.service';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class InspectRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {}

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

    return {
      logs: [
        this.stringMessagesStoreService.createItemInspectedLogMessage(
          actor.name,
          item.identity.label
        ),
      ],
      documentOpened: {
        title: item.title,
        text: item.text,
      },
    };
  }
}

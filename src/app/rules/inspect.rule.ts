import { Injectable } from '@angular/core';

import { errorMessages } from '../definitions/error-messages.definition';
import { createItemInspectedLogs } from '../definitions/log-message.definition';
import { ReadableDefinition } from '../definitions/readable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { RuleInterface } from '../interfaces/rule.interface';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root',
})
export class InspectRule implements RuleInterface {
  constructor(private readonly inventoryService: InventoryService) {}

  public execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const { items } = this.inventoryService.list(actor.id);

    const itemName = event.eventId;

    const itemStored = items.find((i) => i.item.identity.name === itemName);

    if (!itemStored) {
      throw new Error(errorMessages['INVALID-OPERATION']);
    }

    const { item } = itemStored;

    if (!(item instanceof ReadableDefinition)) {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    return {
      logs: [createItemInspectedLogs(actor.name, item.identity.label)],
      documentOpened: {
        title: item.title,
        text: item.text,
      },
    };
  }
}

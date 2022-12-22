import { Injectable } from '@angular/core';

import { ReadableDefinition } from '../definitions/readable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';

import { InventoryService } from '../services/inventory.service';
import { GameMessagesStoreService } from '../stores/game-messages.store';

import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class InspectRule extends MasterRuleService {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  public execute(actor: ActorInterface, event: ActionableEvent): void {
    const itemName = event.eventId;

    const item = this.inventoryService.look<ReadableDefinition>(
      actor.id,
      itemName
    );

    if (!item) {
      throw new Error(GameMessagesStoreService.errorMessages['WRONG-ITEM']);
    }

    const logMessage = GameMessagesStoreService.createItemInspectedLogMessage(
      actor.name,
      item.identity.label
    );

    this.ruleLog.next(logMessage);

    this.documentOpened.next({
      title: item.title,
      text: item.text,
    });
  }
}

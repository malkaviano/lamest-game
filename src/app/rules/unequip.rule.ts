import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class UnEquipRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const weapon = actor.unEquip();

    if (weapon) {
      this.inventoryService.store(actor.name, weapon);

      logs.push(
        this.stringMessagesStoreService.createUnEquippedLogMessage(
          actor.name,
          action.actionableDefinition.label
        )
      );
    }

    return { logs };
  }
}

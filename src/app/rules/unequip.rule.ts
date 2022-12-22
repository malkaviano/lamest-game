import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { GameMessagesStoreService } from '../stores/game-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class UnEquipRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stringMessagesStoreService: GameMessagesStoreService
  ) {
    super();
  }

  public execute(actor: ActorInterface, action: ActionableEvent): void {
    const weapon = actor.unEquip();

    if (weapon) {
      this.inventoryService.store(actor.name, weapon);

      const logMessage =
        this.stringMessagesStoreService.createUnEquippedLogMessage(
          actor.name,
          action.actionableDefinition.label
        );

      this.ruleLog.next(logMessage);
    }
  }
}

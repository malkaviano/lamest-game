import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../stores/game-strings.store';

@Injectable({
  providedIn: 'root',
})
export class UnEquipRule extends MasterRuleService {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  public execute(actor: ActorInterface, action: ActionableEvent): void {
    const weapon = actor.unEquip();

    if (weapon) {
      this.inventoryService.store(actor.name, weapon);

      const logMessage = GameStringsStore.createUnEquippedLogMessage(
        actor.name,
        action.actionableDefinition.label
      );

      this.ruleLog.next(logMessage);
    }
  }
}

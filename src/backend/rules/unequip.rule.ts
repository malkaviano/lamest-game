import { Injectable } from '@angular/core';

import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';

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

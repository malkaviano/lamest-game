import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { CharacterManagerService } from '../services/character-manager.service';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
import { ItemStore } from '../stores/item.store';

@Injectable({
  providedIn: 'root',
})
export class EquipRule implements RuleInterface {
  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly inventoryService: InventoryService,
    private readonly itemStore: ItemStore,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const skillName = this.itemStore.itemSkill(action.eventId);

    if (
      skillName &&
      this.characterManagerService.currentCharacter.skills[skillName] > 0
    ) {
      this.inventoryService.equip(action.eventId);

      this.loggingService.log(
        `equipped: ${this.inventoryService.equipped?.label}`
      );
    } else {
      this.loggingService.log(
        `error: ${skillName} is required to equip ${action.eventId}`
      );
    }
  }
}

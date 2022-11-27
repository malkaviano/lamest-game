import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';

@Injectable({
  providedIn: 'root',
})
export class EquipRule implements RuleInterface {
  constructor(
    private readonly characterManagerService: CharacterService,
    private readonly inventoryService: InventoryService,
    private readonly itemStore: ItemStore
  ) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    const skillName = this.itemStore.itemSkill(action.eventId);

    if (
      skillName &&
      this.characterManagerService.currentCharacter.skills[skillName] > 0
    ) {
      this.inventoryService.equip(action.eventId);

      logs.push(`equipped: ${this.inventoryService.equipped?.label}`);
    } else {
      logs.push(
        `error: ${skillName} is required to equip ${this.itemStore.itemLabel(
          action.eventId
        )}`
      );
    }

    return { logs };
  }
}

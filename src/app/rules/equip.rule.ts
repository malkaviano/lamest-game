import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';
import {
  createEquipErrorLogMessage,
  createEquippedLogMessage,
  createUnEquippedLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';

@Injectable({
  providedIn: 'root',
})
export class EquipRule implements RuleInterface {
  constructor(
    private readonly characterService: CharacterService,
    private readonly inventoryService: InventoryService,
    private readonly itemStore: ItemStore
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const skillName = this.itemStore.itemSkill(action.eventId);

    if (skillName) {
      if (this.characterService.currentCharacter.skills[skillName] > 0) {
        const weapon = this.inventoryService.take('player', action.eventId);

        if (weapon.category === 'WEAPON') {
          const previous = this.characterService.currentCharacter.equip(
            weapon as WeaponDefinition
          );

          if (previous) {
            this.inventoryService.store('player', previous);

            logs.push(createUnEquippedLogMessage('player', previous.label));
          }

          logs.push(createEquippedLogMessage('player', weapon.label));
        }
      } else {
        logs.push(
          createEquipErrorLogMessage(
            'player',
            skillName,
            this.itemStore.itemLabel(action.eventId)
          )
        );
      }
    }

    return { logs };
  }
}

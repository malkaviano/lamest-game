import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import {
  createUnEquippedLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { CharacterService } from '../services/character.service';

@Injectable({
  providedIn: 'root',
})
export class UnEquipRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly characterService: CharacterService
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const weapon = this.characterService.currentCharacter.unEquip();

    if (weapon) {
      this.inventoryService.store('player', weapon);

      logs.push(
        createUnEquippedLogMessage('player', action.actionableDefinition.label)
      );
    }

    return { logs };
  }
}

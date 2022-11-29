import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root',
})
export class UnequipRule implements RuleInterface {
  constructor(private readonly inventoryService: InventoryService) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: string[] = [];

    this.inventoryService.unequip();

    logs.push(`unequipped: ${action.actionableDefinition.label}`);

    return { logs };
  }
}

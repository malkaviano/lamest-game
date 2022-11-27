import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root',
})
export class UnequipRule implements RuleInterface {
  constructor(private readonly inventoryService: InventoryService) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    this.inventoryService.unequip();

    logs.push(`unequipped: ${action.actionableDefinition.label}`);

    return { logs };
  }
}

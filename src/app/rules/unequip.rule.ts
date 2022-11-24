import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class UnequipRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    this.inventoryService.unequip();

    this.loggingService.log(`unequipped: ${action.actionableDefinition.label}`);
  }
}

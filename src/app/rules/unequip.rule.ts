import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import {
  createUnEquippedLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';

@Injectable({
  providedIn: 'root',
})
export class UnEquipRule implements RuleInterface {
  constructor(private readonly inventoryService: InventoryService) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const weapon = actor.unEquip();

    if (weapon) {
      this.inventoryService.store(actor.name, weapon);

      logs.push(
        createUnEquippedLogMessage(
          actor.name,
          action.actionableDefinition.label
        )
      );
    }

    return { logs };
  }
}

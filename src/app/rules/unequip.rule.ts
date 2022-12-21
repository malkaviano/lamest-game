import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class UnEquipRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const weapon = actor.unEquip();

    if (weapon) {
      this.inventoryService.store(actor.name, weapon);

      const logMessage =
        this.stringMessagesStoreService.createUnEquippedLogMessage(
          actor.name,
          action.actionableDefinition.label
        );

      this.ruleLog.next(logMessage);

      logs.push(logMessage);
    }

    return { logs };
  }
}

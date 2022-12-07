import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import {
  createTookLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactive } from '../interfaces/action-reactive.interface';

@Injectable({
  providedIn: 'root',
})
export class PickRule implements RuleInterface {
  constructor(private readonly inventoryService: InventoryService) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    target: ActionReactive
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const item = this.inventoryService.take(
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store(actor.name, item);

    const log = target.reactTo(action.actionableDefinition, 'NONE');

    if (log) {
      logs.push(createTookLogMessage(actor.name, target.name, log));
    }

    return { logs };
  }
}

import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import {
  createTookLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class PickRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const item = this.inventoryService.take(
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store('player', item);

    const interactive = this.narrativeService.interatives[action.eventId];

    const log = interactive.reactTo(action.actionableDefinition, 'NONE');

    if (log) {
      logs.push(createTookLogMessage('player', interactive.name, log));
    }

    return { logs };
  }
}

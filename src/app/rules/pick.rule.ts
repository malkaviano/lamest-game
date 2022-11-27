import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';

@Injectable({
  providedIn: 'root',
})
export class PickRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    const item = this.inventoryService.take(
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store('player', item);

    const interactive = this.narrativeService.interatives[action.eventId];

    const log = interactive.actionSelected(action.actionableDefinition, 'NONE');

    if (log) {
      logs.push(`player: took ${log} from ${interactive.name}`);
    }

    return { logs };
  }
}

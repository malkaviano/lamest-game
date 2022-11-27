import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';

@Injectable({
  providedIn: 'root',
})
export class PickRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const item = this.inventoryService.take(
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store('player', item);

    const interactive = this.narrativeService.interatives[action.eventId];

    interactive.actionSelected(action.actionableDefinition, 'NONE');

    this.loggingService.log(
      `player: took ${item.label} from ${interactive.name}`
    );
  }
}

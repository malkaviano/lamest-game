import { Injectable } from '@angular/core';
import { ReadAxiomService } from '../axioms/read.axiom.service';

import { ReadableDefinition } from '../definitions/readable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '../stores/game-strings.store';
import { MasterRuleService } from './master.rule';

@Injectable({
  providedIn: 'root',
})
export class InspectRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly readAxiomService: ReadAxiomService
  ) {
    super();
  }

  public execute(actor: ActorInterface, event: ActionableEvent): void {
    const itemName = event.eventId;

    const item = this.inventoryService.look<ReadableDefinition>(
      actor.id,
      itemName
    );

    if (!item) {
      throw new Error(GameStringsStore.errorMessages['WRONG-ITEM']);
    }

    const logMessage = GameStringsStore.createItemInspectedLogMessage(
      actor.name,
      item.identity.label
    );

    this.ruleLog.next(logMessage);

    this.readAxiomService.openDocument(item);
  }
}

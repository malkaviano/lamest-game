import { Injectable } from '@angular/core';

import { GameItemDefinition } from '../definitions/game-item.definition';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { InventoryService } from '../services/inventory.service';
import { GameMessagesStore } from '../stores/game-messages.store';

@Injectable({
  providedIn: 'root',
})
export class ExtractorHelper {
  public extractRuleTargetOrThrow(
    ruleExtrasInterface: RuleExtrasInterface
  ): ActionReactiveInterface {
    const target = ruleExtrasInterface.target;

    if (!target) {
      throw new Error(GameMessagesStore.errorMessages['SHOULD-NOT-HAPPEN']);
    }

    return target;
  }

  public extractItemOrThrow<T extends GameItemDefinition>(
    inventoryService: InventoryService,
    actorId: string,
    itemName: string
  ): T {
    const item = inventoryService.take<T>(actorId, itemName);

    if (!item) {
      throw new Error(GameMessagesStore.errorMessages['WRONG-ITEM']);
    }

    return item;
  }
}

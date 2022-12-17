import { Injectable } from '@angular/core';

import { errorMessages } from '../definitions/error-messages.definition';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { GameItemLiteral } from '../literals/game-item.literal';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root',
})
export class ExtractorHelper {
  public extractRuleTargetOrThrow(
    ruleExtrasInterface: RuleExtrasInterface
  ): ActionReactiveInterface {
    const target = ruleExtrasInterface.target;

    if (!target) {
      throw new Error(errorMessages['SHOULD-NOT-HAPPEN']);
    }

    return target;
  }

  public extractItemOrThrow<T>(
    inventoryService: InventoryService,
    category: GameItemLiteral,
    actorId: string,
    itemName: string
  ): T {
    const item = inventoryService
      .check(actorId)
      .items.find(
        (i) => i.item.identity.name === itemName && i.item.category === category
      );

    if (!item) {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    return inventoryService.take(actorId, itemName) as T;
  }
}

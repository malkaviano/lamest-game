import { Injectable } from '@angular/core';

import { GameItemDefinition } from '../../core/definitions/game-item.definition';
import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '../../stores/game-strings.store';

@Injectable({
  providedIn: 'root',
})
export class CheckedHelper {
  public getRuleTargetOrThrow(
    ruleExtrasInterface: RuleExtrasInterface
  ): InteractiveInterface {
    const target = ruleExtrasInterface.target;

    if (!target) {
      throw new Error(GameStringsStore.errorMessages['SHOULD-NOT-HAPPEN']);
    }

    return target;
  }

  public takeItemOrThrow<T extends GameItemDefinition>(
    inventoryService: InventoryService,
    actorId: string,
    itemName: string
  ): T {
    const item = inventoryService.take<T>(actorId, itemName);

    if (!item) {
      throw new Error(GameStringsStore.errorMessages['WRONG-ITEM']);
    }

    return item;
  }

  public lookItemOrThrow<T extends GameItemDefinition>(
    inventoryService: InventoryService,
    actorId: string,
    itemName: string
  ): T {
    const item = inventoryService.look<T>(actorId, itemName);

    if (!item) {
      throw new Error(GameStringsStore.errorMessages['WRONG-ITEM']);
    }

    return item;
  }
}

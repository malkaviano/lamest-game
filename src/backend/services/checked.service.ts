import { GameItemDefinition } from '@definitions/game-item.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { InventoryService } from '@services/inventory.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleValues } from '@values/rule.value';

export class CheckedService {
  public getRuleTargetOrThrow(
    ruleExtrasInterface: RuleValues
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

import { GameItemDefinition } from '../definitions/game-item.definition';
import { InventoryLiteral } from '../literals/inventory.literal';

export class InventoryEvent {
  constructor(
    public readonly eventName: InventoryLiteral,
    public readonly storageName: string,
    public readonly item: GameItemDefinition
  ) {}
}

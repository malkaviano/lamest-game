import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { GameItemLiteral } from '@literals/game-item.literal';
import { ItemUsabilityLiteral } from '@literals/item-usability';

export abstract class GameItemDefinition {
  constructor(
    public readonly category: GameItemLiteral,
    public readonly identity: ItemIdentityDefinition,
    public readonly usability: ItemUsabilityLiteral
  ) {}
}

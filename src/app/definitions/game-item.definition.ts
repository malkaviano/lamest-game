import { GameItemLiteral } from '../literals/game-item.literal';
import { ItemIdentityDefinition } from './item-identity.definition';

export abstract class GameItemDefinition {
  constructor(
    public readonly category: GameItemLiteral,
    public readonly identity: ItemIdentityDefinition
  ) {}
}

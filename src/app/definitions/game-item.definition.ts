import { GameItemLiteral } from '../literals/game-item.literal';

export abstract class GameItemDefinition {
  constructor(
    public readonly category: GameItemLiteral,
    public readonly name: string,
    public readonly label: string,
    public readonly description: string
  ) {}
}

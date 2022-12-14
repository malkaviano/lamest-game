import { GameItemDefinition } from './game-item.definition';

export class ItemStoredDefinition {
  constructor(
    public readonly item: GameItemDefinition,
    public readonly quantity: number
  ) {}
}

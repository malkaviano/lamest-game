import { GameItemDefinition } from './game-item.definition';

export class ItemStorageDefinition {
  constructor(
    public readonly item: GameItemDefinition,
    public readonly quantity: number
  ) {}
}

import { ActionableDefinition } from '@definitions/actionable.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';

export class ActionableItemDefinition {
  constructor(
    public readonly item: GameItemDefinition,
    public readonly action?: ActionableDefinition
  ) {}
}

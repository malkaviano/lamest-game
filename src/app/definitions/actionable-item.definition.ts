import { ActionableDefinition } from './actionable.definition';
import { GameItemDefinition } from './game-item.definition';

export class ActionableItemDefinition {
  constructor(
    public readonly item: GameItemDefinition,
    public readonly action: ActionableDefinition
  ) {}
}

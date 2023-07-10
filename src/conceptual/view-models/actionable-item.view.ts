import { ActionableDefinition } from '../definitions/actionable.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';

export class ActionableItemView {
  private constructor(
    public readonly item: GameItemDefinition,
    public readonly action: ActionableDefinition
  ) {}

  public static create(
    item: GameItemDefinition,
    action: ActionableDefinition
  ): ActionableItemView {
    return new ActionableItemView(item, action);
  }
}

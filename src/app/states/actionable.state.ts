import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { StateLiteral } from '../literals/state.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { GameMessagesStore } from '../stores/game-messages.store';

export abstract class ActionableState {
  constructor(
    public readonly name: StateLiteral,
    protected stateActions: ArrayView<ActionableDefinition>
  ) {}

  public get actions(): ArrayView<ActionableDefinition> {
    return this.stateActions;
  }

  public onResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string } {
    if (!this.stateActions.items.some((a) => a.equals(action))) {
      throw new Error(GameMessagesStore.errorMessages['WRONG-ACTION']);
    }

    return this.stateResult(action, result, values);
  }

  protected abstract stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string };
}

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { errorMessages } from '../definitions/error-messages.definition';
import { StateLiteral } from '../literals/state.literal';

export abstract class ActionableState {
  constructor(
    public readonly entityId: string,
    public readonly name: StateLiteral,
    protected stateActions: ActionableDefinition[]
  ) {}

  public get actions(): ArrayView<ActionableDefinition> {
    return new ArrayView(this.stateActions);
  }

  public execute(action: ActionableDefinition): ActionableState {
    if (!this.stateActions.some((a) => a.equals(action))) {
      throw new Error(errorMessages['WRONG-ACTION']);
    }

    return this.stateResult(action);
  }

  protected abstract stateResult(action: ActionableDefinition): ActionableState;
}

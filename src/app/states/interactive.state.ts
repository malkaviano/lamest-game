import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { StateLiteral } from '../literals/state.literal';

export abstract class InteractiveState {
  constructor(
    public readonly id: StateLiteral,
    protected stateActions: ActionableDefinition[]
  ) {}

  public get actions(): ArrayView<ActionableDefinition> {
    return new ArrayView(this.stateActions);
  }

  public abstract execute(action: ActionableDefinition): InteractiveState;
}

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class DiscardState extends ActionableState {
  constructor(stateActions: ArrayView<ActionableDefinition>) {
    super('DiscardState', stateActions);
  }

  protected override stateResult(action: ActionableDefinition): {
    state: ActionableState;
    log?: string;
  } {
    const actions = this.actions.items;

    const index = actions.indexOf(action);

    return {
      state: new DiscardState(
        ArrayView.create(actions.filter((_, i) => i !== index))
      ),
    };
  }
}

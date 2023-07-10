import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { ActionableState } from '@states/actionable.state';

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
        ArrayView.fromArray(actions.filter((_, i) => i !== index))
      ),
    };
  }
}

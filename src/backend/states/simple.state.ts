import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { ActionableState } from '@states/actionable.state';

export class SimpleState extends ActionableState {
  constructor(stateActions: ArrayView<ActionableDefinition>) {
    super('SimpleState', stateActions);
  }

  protected override stateResult(): { state: ActionableState; log?: string } {
    return { state: this };
  }
}

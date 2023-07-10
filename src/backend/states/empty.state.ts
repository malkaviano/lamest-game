import { ArrayView } from '@wrappers/array.view';
import { ActionableState } from '@states/actionable.state';

class EmptyState extends ActionableState {
  constructor() {
    super('EmptyState', ArrayView.empty());
  }

  // Unreachable code
  /* istanbul ignore next */
  protected override stateResult(): { state: ActionableState; log?: string } {
    return { state: this };
  }
}

export const emptyState = new EmptyState();

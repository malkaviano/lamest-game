import { ArrayView } from '../view-models/array.view';
import { ActionableState } from './actionable.state';

class EmptyState extends ActionableState {
  constructor() {
    super('EmptyState', ArrayView.create());
  }

  // Unreachable code
  /* istanbul ignore next */
  protected override stateResult(): { state: ActionableState; log?: string } {
    return { state: this };
  }
}

export const emptyState = new EmptyState();

import { ActionableState } from './actionable.state';

class EmptyState extends ActionableState {
  constructor() {
    super('EmptyState', []);
  }

  // Unreachable code
  /* istanbul ignore next */
  protected override stateResult(): ActionableState {
    return this;
  }
}

export const emptyState = new EmptyState();
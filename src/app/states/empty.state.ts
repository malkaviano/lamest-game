import { errorMessages } from '../definitions/error-messages.definition';
import { ActionableState } from './actionable.state';

class EmptyState extends ActionableState {
  constructor() {
    super('emptyState', 'EmptyState', []);
  }

  protected override stateResult(): ActionableState {
    throw new Error(errorMessages['SHOULD-NOT-HAPPEN']);
  }
}

export const emptyState = new EmptyState();

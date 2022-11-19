import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionableState } from './actionable.state';

export class SimpleState extends ActionableState {
  constructor(
    entityId: string,
    stateActions: ActionableDefinition[],
    protected readonly msg: string
  ) {
    super(entityId, 'SimpleState', stateActions);
  }

  protected stateResult(action: ActionableDefinition): ActionableState {
    return this;
  }
}

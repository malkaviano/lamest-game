import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionLogDefinition } from '../definitions/action-log.definition';
import { StateResult } from '../results/state.result';
import { ActionableState } from './actionable.state';

export class SimpleState extends ActionableState {
  constructor(
    entityId: string,
    stateActions: ActionableDefinition[],
    protected readonly msg: string
  ) {
    super(entityId, 'BasicState', stateActions);
  }

  protected stateResult(action: ActionableDefinition): StateResult {
    return new StateResult(
      this,
      new ActionLogDefinition(action.label, this.msg)
    );
  }
}

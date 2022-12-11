import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class LockedContainerState extends ActionableState {
  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    protected readonly openedState: ActionableState
  ) {
    super('LockedContainerState', stateActions);
  }

  protected stateResult(
    action: ActionableDefinition,
    result: ResultLiteral
  ): { state: ActionableState; log?: string } {
    if (result === 'USED') {
      return {
        state: this.openedState,
        log: `was opened using ${action.label}`,
      };
    }

    return { state: this };
  }
}

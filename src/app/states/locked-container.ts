import { ActionableDefinition } from '../definitions/actionable.definition';
import { createOpenedUsingMessage } from '../definitions/log-message.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class LockedContainerState extends ActionableState {
  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    protected readonly openedState: LazyHelper<ActionableState>
  ) {
    super('LockedContainerState', stateActions);
  }

  protected stateResult(
    action: ActionableDefinition,
    result: ResultLiteral
  ): { state: ActionableState; log?: string } {
    if (result === 'USED') {
      return {
        state: this.openedState.value,
        log: createOpenedUsingMessage(action.label),
      };
    }

    return { state: this };
  }
}

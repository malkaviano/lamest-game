import { ActionableDefinition } from '../definitions/actionable.definition';
import { createOpenedUsingMessage } from '../definitions/log-message.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class LockedContainerState extends ActionableState {
  constructor(
    stateAction: ArrayView<ActionableDefinition>,
    protected readonly openedState: LazyHelper<ActionableState>
  ) {
    super('LockedContainerState', stateAction);
  }

  protected stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string } {
    const item = values.item;

    if (
      super.actions.items.some((a) => a.name === action.name) &&
      item &&
      result === 'USED'
    ) {
      return {
        state: this.openedState.value,
        log: createOpenedUsingMessage(item.identity.label),
      };
    }
    return { state: this };
  }
}

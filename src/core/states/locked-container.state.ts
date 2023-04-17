import { ActionableDefinition } from '../definitions/actionable.definition';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableState } from './actionable.state';
import { ArrayView } from '../view-models/array.view';
import { LazyHelper } from '../helpers/lazy.helper';

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
        log: GameStringsStore.createOpenedUsingMessage(item.identity.label),
      };
    }
    return { state: this };
  }
}

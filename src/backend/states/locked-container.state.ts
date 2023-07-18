import { ActionableDefinition } from '@definitions/actionable.definition';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableState } from '@states/actionable.state';
import { ArrayView } from '@wrappers/array.view';
import { LazyHelper } from '@helpers/lazy.helper';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { ReactionValuesDefinition } from '@definitions/reaction-values.definition';

export class LockedContainerState extends ActionableState {
  constructor(
    stateAction: ArrayView<ActionableDefinition>,
    protected readonly openedState: LazyHelper<ActionableState>
  ) {
    super('LockedContainerState', stateAction);
  }

  protected stateResult(
    action: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValuesDefinition
  ): { state: ActionableState; log?: string } {
    const item = values.item;

    if (super.actions.items.some((a) => a.name === action.name) && item) {
      return {
        state: this.openedState.value,
        log: GameStringsStore.createOpenedUsingMessage(item.identity.label),
      };
    }
    return { state: this };
  }
}

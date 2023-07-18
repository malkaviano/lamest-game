import { ActionableDefinition } from '@definitions/actionable.definition';
import { LazyHelper } from '@helpers/lazy.helper';
import { ReactionValues } from '@values/reaction.values';
import { ArrayView } from '@wrappers/array.view';
import { ActionableState } from '@states/actionable.state';
import { LockPickingContainerState } from '@states/lock-picking-container.state';
import { LockedContainerState } from '@states/locked-container.state';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { GameStringsStore } from '@stores/game-strings.store';

export class LockPickableContainerState extends LockedContainerState {
  constructor(
    private readonly actionables: ArrayView<ActionableDefinition>,
    private readonly lockPickingContainerState: LockPickingContainerState,
    openedState: LazyHelper<ActionableState>
  ) {
    super(actionables, openedState);
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValues
  ): { state: ActionableState; log?: string } {
    if (
      action.actionable === 'INTERACTION' &&
      this.actionables.items.some((a) => a.name === action.name)
    ) {
      return {
        state: this.lockPickingContainerState,
        log: GameStringsStore.createStartedLockPickingMessage(),
      };
    }

    return super.stateResult(action, result, values);
  }
}

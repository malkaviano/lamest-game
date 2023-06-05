import { GameStringsStore } from 'src/stores/game-strings.store';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../view-models/array.view';
import { ActionableState } from './actionable.state';
import { LockPickingContainerState } from './lock-picking-container.state';
import { LockedContainerState } from './locked-container.state';

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
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string | undefined } {
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

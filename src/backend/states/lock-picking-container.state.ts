import { ActionableDefinition } from '@definitions/actionable.definition';
import { directionNamesDefinition } from '@definitions/directions.definition';
import { ReactionValues } from '@values/reaction.values';
import { DirectionLiteral } from '@literals/direction.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableState } from '@states/actionable.state';
import { LockedContainerState } from '@states/locked-container.state';
import { ArrayView } from '@wrappers/array.view';
import { LazyHelper } from '@helpers/lazy.helper';
import { CheckResultLiteral } from '@literals/check-result.literal';

export class LockPickingContainerState extends LockedContainerState {
  private lockPosition: number;

  private sequence: number;

  private tries: number;

  constructor(
    lockPickActions: ArrayView<ActionableDefinition>,
    private readonly jammedStateActions: ArrayView<ActionableDefinition>,
    openedState: LazyHelper<ActionableState>,
    private readonly lockSequence: ArrayView<DirectionLiteral>,
    private readonly maximumTries: number
  ) {
    super(lockPickActions.concat(jammedStateActions), openedState);

    this.lockPosition = 0;

    this.sequence = 0;

    this.tries = 0;
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValues
  ): { state: ActionableState; log?: string } {
    const direction = action.name as DirectionLiteral;

    if (
      action.actionable === 'INTERACTION' &&
      directionNamesDefinition.items.includes(direction)
    ) {
      if (this.lockSequence.items[this.lockPosition] === direction) {
        this.lockPosition++;

        this.sequence++;

        if (this.sequence === this.lockSequence.items.length) {
          return {
            state: this.openedState.value,
            log: GameStringsStore.createLockPickOpenedMessage(direction),
          };
        }

        return {
          state: this,
          log: GameStringsStore.createLockPickMovedMessage(direction),
        };
      }

      this.lockPosition = 0;

      this.sequence = 0;

      this.tries++;

      if (this.tries === this.maximumTries) {
        return {
          state: new LockedContainerState(
            this.jammedStateActions,
            this.openedState
          ),
          log: GameStringsStore.createLockPickJammedMessage(direction),
        };
      }

      return {
        state: this,
        log: GameStringsStore.createLockPickStuckMessage(direction),
      };
    }

    return super.stateResult(action, result, values);
  }
}

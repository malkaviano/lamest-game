import { ActionableDefinition } from '../definitions/actionable.definition';
import { directionNamesDefinition } from '../definitions/directions.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { DirectionLiteral } from '../literals/direction.literal';
import { ResultLiteral } from '../literals/result.literal';
import { GameStringsStore } from '../stores/game-strings.store';

import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { LockedContainerState } from './locked-container.state';

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
    super(
      ArrayView.create([...lockPickActions.items, ...jammedStateActions.items]),
      openedState
    );

    this.lockPosition = 0;

    this.sequence = 0;

    this.tries = 0;
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
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
            log: GameStringsStore.createLockpickOpenedMessage(direction),
          };
        }

        return {
          state: this,
          log: GameStringsStore.createLockpickMovedMessage(direction),
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
          log: GameStringsStore.createLockpickJammedMessage(direction),
        };
      }

      return {
        state: this,
        log: GameStringsStore.createLockpickStuckMessage(direction),
      };
    }

    return super.stateResult(action, result, values);
  }
}

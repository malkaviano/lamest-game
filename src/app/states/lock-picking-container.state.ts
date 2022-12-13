import { ActionableDefinition } from '../definitions/actionable.definition';
import { directionNamesDefinition } from '../definitions/directions.definition';
import {
  createLockpickOpenedMessage,
  createLockpickMovedMessage,
  createLockpickStuckMessage,
  createLockpickJammedMessage,
} from '../definitions/log-message.definition';

import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { DirectionLiteral } from '../literals/direction.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { LockedContainerState } from './locked-container';

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
      new ArrayView([...lockPickActions.items, ...jammedStateActions.items]),
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
            log: createLockpickOpenedMessage(direction),
          };
        }

        return { state: this, log: createLockpickMovedMessage(direction) };
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
          log: createLockpickJammedMessage(direction),
        };
      }

      return { state: this, log: createLockpickStuckMessage(direction) };
    }

    return super.stateResult(action, result, values);
  }

  private removeLockPickingActions(): ArrayView<ActionableDefinition> {
    const actions = this.stateActions.items.filter(
      (i) =>
        !directionNamesDefinition.items.includes(i.name as DirectionLiteral)
    );

    return new ArrayView(actions);
  }
}

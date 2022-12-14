import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../views/array.view';
import { DiscardState } from './discard.state';
import { LockPickingContainerState } from './lock-picking-container.state';
import {
  createLockpickOpenedMessage,
  createLockpickMovedMessage,
  createLockpickStuckMessage,
  createOpenedUsingMessage,
  createLockpickJammedMessage,
} from '../definitions/log-message.definition';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { LockedContainerState } from './locked-container';
import { ActionableState } from './actionable.state';
import {
  directionActionableDefinition,
  directionNamesDefinition,
} from '../definitions/directions.definition';

import { actionUseMasterKey, lootState, masterKey } from '../../../tests/fakes';

const f = () => lootState;

const jammedState = new LockedContainerState(
  new ArrayView([actionUseMasterKey]),
  new LazyHelper<DiscardState>(f)
);

const allDirectionsDefinition = new ArrayView(
  directionNamesDefinition.items.map((direction) => {
    return directionActionableDefinition(direction, `Turn ${direction}`);
  })
);

const fakeState = () =>
  new LockPickingContainerState(
    allDirectionsDefinition,
    new ArrayView([actionUseMasterKey]),
    new LazyHelper<DiscardState>(f),
    new ArrayView(['LEFT', 'DOWN']),
    3
  );

const logLeft = createLockpickMovedMessage('LEFT');

const logRight = createLockpickStuckMessage('RIGHT');

const logOpen = createLockpickOpenedMessage('DOWN');

const logUp = createLockpickStuckMessage('UP');

const logJammed = createLockpickJammedMessage('UP');

const log = createOpenedUsingMessage('Master Key');

describe('LockPickingContainerState', () => {
  describe('when using a master key', () => {
    it('return discarded state and log', () => {
      const result = fakeState().onResult(actionUseMasterKey, 'USED', {
        item: masterKey,
      });

      expect(result).toEqual({
        state: lootState,
        log,
      });
    });
  });

  describe('when picking the lock', () => {
    describe(`when input sequence was LEFT, RIGHT, UP, LEFT, DOWN`, () => {
      it('should be opened in the end', () => {
        const s = fakeState();

        [
          {
            direction: 'LEFT',
            state: s,
            log: logLeft,
          },
          {
            direction: 'RIGHT',
            state: s,
            log: logRight,
          },
          {
            direction: 'UP',
            state: s,
            log: logUp,
          },
          {
            direction: 'LEFT',
            state: s,
            log: logLeft,
          },
          {
            direction: 'DOWN',
            state: lootState,
            log: logOpen,
          },
        ].forEach(({ direction, state, log }) => {
          scenario(s, direction, state, log);
        });
      });
    });

    describe(`when input sequence was LEFT, RIGHT, UP, LEFT, UP`, () => {
      it('should be jammed in the end', () => {
        const s = fakeState();

        [
          {
            direction: 'LEFT',
            state: s,
            log: logLeft,
          },
          {
            direction: 'RIGHT',
            state: s,
            log: logRight,
          },
          {
            direction: 'UP',
            state: s,
            log: logUp,
          },
          {
            direction: 'LEFT',
            state: s,
            log: logLeft,
          },
          {
            direction: 'UP',
            state: jammedState,
            log: logJammed,
          },
        ].forEach(({ direction, state, log }) => {
          scenario(s, direction, state, log);
        });
      });
    });
  });
});

function scenario(
  s: LockPickingContainerState,
  direction: string,
  state: ActionableState,
  log: string
) {
  const result = s.onResult(
    createActionableDefinition('INTERACTION', direction, `Turn ${direction}`),
    'NONE',
    {}
  );

  expect(result).toEqual({
    state,
    log,
  });
}

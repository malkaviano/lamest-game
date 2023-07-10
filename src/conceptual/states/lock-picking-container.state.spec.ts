import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../view-models/array.view';
import { DiscardState } from './discard.state';
import { LockPickingContainerState } from './lock-picking-container.state';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { LockedContainerState } from './locked-container.state';
import { ActionableState } from './actionable.state';
import {
  directionActionableDefinition,
  directionNamesDefinition,
} from '../definitions/directions.definition';

import { actionUseMasterKey, lootState, masterKey } from '../../../tests/fakes';
import { setupMocks } from '../../../tests/mocks';

const f = () => lootState;

const jammedState = new LockedContainerState(
  ArrayView.create(actionUseMasterKey),
  new LazyHelper<DiscardState>(f)
);

const allDirectionsDefinition = ArrayView.fromArray(
  directionNamesDefinition.items.map((direction) => {
    return directionActionableDefinition(direction, `Turn ${direction}`);
  })
);

const fakeState = () =>
  new LockPickingContainerState(
    allDirectionsDefinition,
    ArrayView.create(actionUseMasterKey),
    new LazyHelper<DiscardState>(f),
    ArrayView.create('LEFT', 'DOWN'),
    3
  );

const logLeft = 'Lock Pick moved LEFT';

const logRight = 'Lock Pick got stuck moving RIGHT';

const logOpen = 'Lock Pick moved DOWN and opened the container';

const logUp = 'Lock Pick got stuck moving UP';

const logJammed =
  'Lock Pick got stuck moving UP and cannot be lock picked anymore';

const log = 'was opened using Master Key';

describe('LockPickingContainerState', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('when using a master key', () => {
    it('return discarded state and log', () => {
      const result = fakeState().onResult(actionUseMasterKey, 'NONE', {
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

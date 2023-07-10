import {
  directionActionableDefinition,
  directionNamesDefinition,
} from '../definitions/directions.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../view-models/array.view';
import { DiscardState } from './discard.state';
import { LockPickableContainerState } from './lock-pickable-container.state';
import { createActionableDefinition } from '../definitions/actionable.definition';

import { actionUseMasterKey, lootState, masterKey } from 'tests/fakes';
import { LockPickingContainerState } from './lock-picking-container.state';
import { setupMocks } from 'tests/mocks';

const f = () => lootState;

const actionInteractionLockPick = createActionableDefinition(
  'INTERACTION',
  'lockpick',
  'START Lock Picking'
);

const allDirectionsDefinition = ArrayView.fromArray(
  directionNamesDefinition.items.map((direction) => {
    return directionActionableDefinition(direction, `Turn ${direction}`);
  })
);

const lockpickingState = new LockPickingContainerState(
  allDirectionsDefinition,
  ArrayView.create(actionUseMasterKey),
  new LazyHelper<DiscardState>(f),
  ArrayView.create('LEFT', 'DOWN'),
  3
);

const fakeState = () =>
  new LockPickableContainerState(
    ArrayView.create(actionInteractionLockPick, actionUseMasterKey),
    lockpickingState,
    new LazyHelper<DiscardState>(f)
  );

const logLockPicking = 'started lock picking the container';

const log = 'was opened using Master Key';

describe('LockPickableContainerState', () => {
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

  describe('when lock pick was choosen', () => {
    it('return LockPickingContainerState', () => {
      const result = fakeState().onResult(
        actionInteractionLockPick,
        'NONE',
        {}
      );

      expect(result).toEqual({
        state: lockpickingState,
        log: logLockPicking,
      });
    });
  });
});

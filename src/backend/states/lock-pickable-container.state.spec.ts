import {
  directionActionableDefinition,
  directionNamesDefinition,
} from '@definitions/directions.definition';
import { LazyHelper } from '@helpers/lazy.helper';
import { ArrayView } from '@wrappers/array.view';
import { DiscardState } from '@states/discard.state';
import { LockPickableContainerState } from '@states/lock-pickable-container.state';
import { createActionableDefinition } from '@definitions/actionable.definition';

import { actionUseDiscardKey, lootState, discardKey } from 'tests/fakes';
import { LockPickingContainerState } from '@states/lock-picking-container.state';

import { setupMocks } from 'tests/mocks';

const f = () => lootState;

const actionInteractionLockPick = createActionableDefinition(
  'INTERACTION',
  'lockpick',
  'START Lock Picking'
);

const allDirectionsDefinition = ArrayView.fromArray(
  directionNamesDefinition.items.map((direction) => {
    return directionActionableDefinition(direction, direction);
  })
);

const lockpickingState = new LockPickingContainerState(
  allDirectionsDefinition,
  ArrayView.create(actionUseDiscardKey),
  new LazyHelper<DiscardState>(f),
  ArrayView.create('LEFT', 'DOWN'),
  3
);

const fakeState = () =>
  new LockPickableContainerState(
    ArrayView.create(actionInteractionLockPick, actionUseDiscardKey),
    lockpickingState,
    new LazyHelper<DiscardState>(f)
  );

const logLockPicking = 'started lock picking the container';

const log = 'was opened using Discard Key';

describe('LockPickableContainerState', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('when using a master key', () => {
    it('return discarded state and log', () => {
      const result = fakeState().onResult(actionUseDiscardKey, 'NONE', {
        item: discardKey,
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

import { ArrayView } from '@wrappers/array.view';
import { LockedContainerState } from './locked-container.state';
import { LazyHelper } from '../../backend/helpers/lazy.helper';
import { DiscardState } from './discard.state';

import { actionUseMasterKey, lootState, masterKey } from '../../../tests/fakes';
import { setupMocks } from '../../../tests/mocks';

describe('LockedContainerState', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe(`when item was not in player's inventory`, () => {
    it('return same state', () => {
      const result = state.onResult(actionUseMasterKey, 'NONE', {});

      expect(result).toEqual({ state: state });
    });
  });

  describe(`when item was in player's inventory`, () => {
    it('return discarded state and log', () => {
      const result = state.onResult(actionUseMasterKey, 'NONE', {
        item: masterKey,
      });

      expect(result).toEqual({
        state: lootState,
        log,
      });
    });
  });
});

const state = new LockedContainerState(
  ArrayView.create(actionUseMasterKey),
  new LazyHelper<DiscardState>(() => lootState)
);

const log = 'was opened using Master Key';

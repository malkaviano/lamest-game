import { ArrayView } from '@wrappers/array.view';
import { LockedContainerState } from '@states/locked-container.state';
import { LazyHelper } from '@helpers/lazy.helper';
import { DiscardState } from '@states/discard.state';

import {
  actionUseDiscardKey,
  lootState,
  discardKey,
} from '../../../tests/fakes';
import { setupMocks } from '../../../tests/mocks';

describe('LockedContainerState', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe(`when item was not in player's inventory`, () => {
    it('return same state', () => {
      const result = state.onResult(actionUseDiscardKey, 'NONE', {});

      expect(result).toEqual({ state: state });
    });
  });

  describe(`when item was in player's inventory`, () => {
    it('return discarded state and log', () => {
      const result = state.onResult(actionUseDiscardKey, 'NONE', {
        item: discardKey,
      });

      expect(result).toEqual({
        state: lootState,
        log,
      });
    });
  });
});

const state = new LockedContainerState(
  ArrayView.create(actionUseDiscardKey),
  new LazyHelper<DiscardState>(() => lootState)
);

const log = 'was opened using Discard Key';

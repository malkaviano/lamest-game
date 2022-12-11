import { ArrayView } from '../views/array.view';
import { LockedContainerState } from './locked-container';

import { actionUse, lootState } from '../../../tests/fakes';
import { LazyHelper } from '../helpers/lazy.helper';
import { DiscardState } from './discard.state';

describe('LockedContainerState', () => {
  describe(`when item was not in player's inventory`, () => {
    it('return same state', () => {
      const result = state.onResult(actionUse, 'NONE');

      expect(result).toEqual({ state: state });
    });
  });

  describe(`when item was in player's inventory`, () => {
    it('return discarded state and log', () => {
      const result = state.onResult(actionUse, 'USED');

      expect(result).toEqual({
        state: lootState,
        log: 'was opened using Master Key',
      });
    });
  });
});

const state = new LockedContainerState(
  new ArrayView([actionUse]),
  new LazyHelper<DiscardState>(() => lootState)
);

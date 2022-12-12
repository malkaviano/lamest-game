import { ArrayView } from '../views/array.view';
import { LockedContainerState } from './locked-container';

import { actionUseMasterKey, lootState } from '../../../tests/fakes';
import { LazyHelper } from '../helpers/lazy.helper';
import { DiscardState } from './discard.state';
import { createOpenedUsingMessage } from '../definitions/log-message.definition';

describe('LockedContainerState', () => {
  describe(`when item was not in player's inventory`, () => {
    it('return same state', () => {
      const result = state.onResult(actionUseMasterKey, 'NONE');

      expect(result).toEqual({ state: state });
    });
  });

  describe(`when item was in player's inventory`, () => {
    it('return discarded state and log', () => {
      const result = state.onResult(actionUseMasterKey, 'USED');

      expect(result).toEqual({
        state: lootState,
        log,
      });
    });
  });
});

const state = new LockedContainerState(
  new ArrayView([actionUseMasterKey]),
  new LazyHelper<DiscardState>(() => lootState)
);

const log = createOpenedUsingMessage('Master Key');

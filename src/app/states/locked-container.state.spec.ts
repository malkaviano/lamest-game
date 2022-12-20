import { instance, when } from 'ts-mockito';

import { ArrayView } from '../views/array.view';
import { LockedContainerState } from './locked-container.state';
import { LazyHelper } from '../helpers/lazy.helper';
import { DiscardState } from './discard.state';

import { actionUseMasterKey, lootState, masterKey } from '../../../tests/fakes';
import {
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';

describe('LockedContainerState', () => {
  beforeEach(() => {
    setupMocks();

    when(
      mockedStringMessagesStoreService.createOpenedUsingMessage('Master Key')
    ).thenReturn('createOpenedUsingMessage-Master Key');
  });

  describe(`when item was not in player's inventory`, () => {
    it('return same state', () => {
      const result = state.onResult(actionUseMasterKey, 'NONE', {});

      expect(result).toEqual({ state: state });
    });
  });

  describe(`when item was in player's inventory`, () => {
    it('return discarded state and log', () => {
      const result = state.onResult(actionUseMasterKey, 'USED', {
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
  ArrayView.create([actionUseMasterKey]),
  new LazyHelper<DiscardState>(() => lootState),
  instance(mockedStringMessagesStoreService)
);

const log = 'createOpenedUsingMessage-Master Key';

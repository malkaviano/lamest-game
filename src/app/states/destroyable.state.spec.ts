import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../views/array.view';
import { DestroyableState } from './destroyable.state';
import { DiscardState } from './discard.state';

import {
  actionAttack,
  actionPickSimpleSword,
  fakeEffect,
} from '../../../tests/fakes';
import { instance, when } from 'ts-mockito';
import {
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';

const logKinetic6 = 'KINETIC-6';

const logKinetic12 = 'KINETIC-12';

describe('DestroyableState', () => {
  beforeEach(() => {
    setupMocks();

    when(
      mockedStringMessagesStoreService.createEffectDamagedMessage(
        'KINETIC',
        '6'
      )
    ).thenReturn(logKinetic6);

    when(
      mockedStringMessagesStoreService.createDestroyedByDamageMessage(
        'KINETIC',
        '12'
      )
    ).thenReturn(logKinetic12);
  });

  describe('when HP <= 0', () => {
    it('return DiscardState', () => {
      const result = state.onResult(actionAttack, 'SUCCESS', {
        effect: fakeEffect('KINETIC', 12),
      });

      expect(result).toEqual({
        state: discardedState,
        log: logKinetic12,
      });
    });
  });

  describe('when HP > 0', () => {
    it('return DestroyableState with remaining HP', () => {
      const result = state.onResult(actionAttack, 'SUCCESS', {
        effect: fakeEffect('KINETIC', 6),
      });

      expect(result).toEqual({ state: state2, log: logKinetic6 });
    });
  });

  describe('when no damage is taken', () => {
    it('return DestroyableState with same HP', () => {
      const result = state.onResult(actionAttack, 'FAILURE', {});

      expect(result).toEqual({ state });
    });
  });
});

const discardedState = new DiscardState(
  ArrayView.create([actionPickSimpleSword])
);

const f = () => discardedState;

const lazy = new LazyHelper(f);

const fakeMessageStore = instance(mockedStringMessagesStoreService);

const state = new DestroyableState(
  ArrayView.create([actionAttack]),
  lazy,
  10,
  fakeMessageStore
);

const state2 = new DestroyableState(
  ArrayView.create([actionAttack]),
  lazy,
  4,
  fakeMessageStore
);

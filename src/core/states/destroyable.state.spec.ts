import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../view-models/array.view';
import { DestroyableState } from './destroyable.state';
import { DiscardState } from './discard.state';

import {
  actionAttack,
  actionPickSimpleSword,
  fakeEffect,
} from '../../../tests/fakes';
import { setupMocks } from '../../../tests/mocks';

const logKinetic6 = 'received 6 KINETIC damage';

const logKinetic12 = 'received 12 KINETIC damage and was destroyed';

describe('DestroyableState', () => {
  beforeEach(() => {
    setupMocks();
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

const state = new DestroyableState(ArrayView.create([actionAttack]), lazy, 10);

const state2 = new DestroyableState(ArrayView.create([actionAttack]), lazy, 4);
import {
  createEffectDamagedMessage,
  createDestroyedByDamageMessage,
} from '../definitions/log-message.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../views/array.view';
import { DestroyableState } from './destroyable.state';
import { DiscardState } from './discard.state';

import {
  actionAttack,
  actionPickSimpleSword,
  fakeEffect,
} from '../../../tests/fakes';

describe('DestroyableState', () => {
  describe('when HP <= 0', () => {
    it('return DiscardState', () => {
      const result = state.onResult(actionAttack, 'SUCCESS', {
        effect: fakeEffect('KINETIC', 12),
      });

      expect(result).toEqual({
        state: discardedState,
        log: log12,
      });
    });
  });

  describe('when HP > 0', () => {
    it('return DestroyableState with remaining HP', () => {
      const result = state.onResult(actionAttack, 'SUCCESS', {
        effect: fakeEffect('KINETIC', 6),
      });

      expect(result).toEqual({ state: state2, log: log6 });
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

const log6 = createEffectDamagedMessage(6, 'KINETIC');

const log12 = createDestroyedByDamageMessage(12, 'KINETIC');

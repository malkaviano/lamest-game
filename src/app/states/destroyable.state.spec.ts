import { createActionableDefinition } from '../definitions/actionable.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../views/array.view';
import { DestroyableState } from './destroyable.state';
import { DiscardState } from './discard.state';

describe('DestroyableState', () => {
  describe('when HP <= 0', () => {
    it('return DiscardState', () => {
      const result = state.onResult(attackAction, 'SUCCESS', 12);

      expect(result).toEqual({
        state: discardedState,
        log: 'received 12 damage and was destroyed',
      });
    });
  });

  describe('when HP > 0', () => {
    it('return DestroyableState with remaining HP', () => {
      const result = state.onResult(attackAction, 'SUCCESS', 6);

      expect(result).toEqual({ state: state2, log: 'received 6 damage' });
    });
  });

  describe('when no damage is taken', () => {
    it('return DestroyableState with same HP', () => {
      const result = state.onResult(attackAction, 'FAILURE');

      expect(result).toEqual({ state });
    });
  });

  describe('when skill action is received', () => {
    describe('when it was a SUCCESS', () => {
      it('return DiscardState', () => {
        const result = state.onResult(dismantleAction, 'SUCCESS');

        expect(result).toEqual({
          state: discardedState,
          log: 'destroyed by Dismantle using Engineering (Mechanical)',
        });
      });
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const knifeAction = createActionableDefinition(
  'PICK',
  'knife',
  'Hunting Knife'
);

const dismantleAction = createActionableDefinition(
  'SKILL',
  'Engineering (Mechanical)',
  'Dismantle'
);

const discardedState = new DiscardState(new ArrayView([knifeAction]));

const f = () => discardedState;

const lazy = new LazyHelper(f);

const state = new DestroyableState(
  new ArrayView([attackAction, dismantleAction]),
  lazy,
  10
);

const state2 = new DestroyableState(
  new ArrayView([attackAction, dismantleAction]),
  lazy,
  4
);

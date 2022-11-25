import { createActionableDefinition } from '../definitions/actionable.definition';
import { DestroyableState } from './destroyable.state';
import { DiscardState } from './discard.state';

describe('DestroyableState', () => {
  describe('when HP <= 0', () => {
    it('return DiscardState', () => {
      const result = state.onResult(attackAction, 'SUCCESS', 12);

      expect(result).toEqual({
        state: discardedState,
        log: 'received 12 damage, it is destroyed',
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
      const result = state.onResult(attackAction, 'SUCCESS');

      expect(result).toEqual({ state, log: 'received 0 damage' });
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const knifeAction = createActionableDefinition(
  'PICK',
  'knife',
  'Hunting Knife'
);

const discardedState = new DiscardState([knifeAction]);

const state = new DestroyableState([attackAction], discardedState, 10);

const state2 = new DestroyableState(
  [attackAction],
  new DiscardState([knifeAction]),
  4
);

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DestroyableState } from './destroyable.state';
import { DiscardState } from './discard.state';

describe('DestroyableState', () => {
  describe('when HP <= 0', () => {
    it('return DiscardState', () => {
      const result = state.onResult(attackAction, 'SUCCESS', 12);

      expect(result).toEqual(discardedState);
    });
  });

  describe('when HP > 0', () => {
    it('return DestroyableState with remaining HP', () => {
      const result = state.onResult(attackAction, 'SUCCESS', 6);

      expect(result).toEqual(state2);
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

import { createActionableDefinition } from '../definitions/actionable.definition';
import { emptyState } from './empty.state';
import { TryState } from './try.state';

describe('TryState', () => {
  describe('when action succeeds', () => {
    it('return an empty state"', () => {
      const state = state1();

      const result = state.onResult(pickAction, 'SUCCESS');

      expect(result).toEqual(state2);
    });
  });

  describe('when action fails', () => {
    describe('when maximum tries was not reached', () => {
      it('return the same state"', () => {
        const state = state1();

        const result = state.onResult(pickAction, 'FAILURE');

        expect(result).toEqual(state);
      });
    });

    describe('when maximum tries was reached', () => {
      it('return an empty state"', () => {
        const state = state1();

        state.onResult(pickAction, 'FAILURE');

        const result = state.onResult(pickAction, 'FAILURE');

        expect(result).toEqual(state2);
      });
    });
  });
});

const pickAction = createActionableDefinition(
  'PICK',
  'basic1',
  'pickBubbleGum',
  'Get bubble gum'
);

const state1 = () => new TryState('basic1', pickAction, 2);

const state2 = emptyState;

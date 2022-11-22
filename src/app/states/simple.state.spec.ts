import { createActionableDefinition } from '../definitions/actionable.definition';
import { SimpleState } from './simple.state';

describe('SimpleState', () => {
  describe('execute action', () => {
    describe('when known message received', () => {
      it('return same state"', () => {
        const result = state.onResult(pickAction, 'FAILURE');

        expect(result).toEqual(state);
      });
    });
  });
});

const askAction1 = createActionableDefinition('ASK', 'ask1', 'May I help?');
const askAction2 = createActionableDefinition('ASK', 'ask2', 'Are you ok?');
const pickAction = createActionableDefinition(
  'PICK',
  'pickBubbleGum',
  'Get bubble gum'
);

const state = new SimpleState([askAction1, askAction2, pickAction]);

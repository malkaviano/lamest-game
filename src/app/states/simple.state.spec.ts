import { createActionableDefinition } from '../definitions/actionable.definition';
import { SimpleState } from './simple.state';

const askAction1 = createActionableDefinition(
  'ASK',
  'basic1',
  'ask1',
  'May I help?'
);
const askAction2 = createActionableDefinition(
  'ASK',
  'basic1',
  'ask2',
  'Are you ok?'
);
const pickAction = createActionableDefinition(
  'PICK',
  'basic1',
  'pickBubbleGum',
  'Get bubble gum'
);

const state = new SimpleState(
  'basic1',
  [askAction1, askAction2, pickAction],
  'selected'
);

describe('SimpleState', () => {
  describe('execute action', () => {
    describe('when known message received', () => {
      it('return same state and log "executed"', () => {
        const result = state.execute(pickAction);

        expect(result).toEqual(state);
      });
    });
  });
});

import { createActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { SimpleState } from '@states/simple.state';

describe('SimpleState', () => {
  describe('execute action', () => {
    describe('when known message received', () => {
      it('return same state"', () => {
        const result = state.onResult(pickAction, 'FAILURE', {});

        expect(result).toEqual({ state });
      });
    });
  });
});

const askAction1 = createActionableDefinition(
  'INTERACTION',
  'ask1',
  'May I help?'
);
const askAction2 = createActionableDefinition(
  'INTERACTION',
  'ask2',
  'Are you ok?'
);
const pickAction = createActionableDefinition(
  'PICK',
  'pickBubbleGum',
  'Get bubble gum'
);

const state = new SimpleState(
  ArrayView.create(askAction1, askAction2, pickAction)
);

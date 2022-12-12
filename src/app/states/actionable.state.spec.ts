import { createActionableDefinition } from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

describe('ActionableState', () => {
  describe('execute action', () => {
    describe('when unknown message received', () => {
      it('throw "WRONG-ACTION"', () => {
        expect(() => state.onResult(unknownAction, 'NONE', {})).toThrowError(
          errorMessages['WRONG-ACTION']
        );
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

const unknownAction = createActionableDefinition('CONSUME', 'error', 'unknown');

const state = new (class extends ActionableState {
  protected override stateResult(): { state: ActionableState; log?: string } {
    throw new Error('SHOULD NOT HAPPEN');
  }
})('SimpleState', new ArrayView([askAction1, askAction2, pickAction]));

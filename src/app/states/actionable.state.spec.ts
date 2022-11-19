import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ActionableState } from './actionable.state';

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

const unknownAction = createActionableDefinition('CLOSE', 'error', 'unknown');

const state = new (class extends ActionableState {
  protected stateResult(_: ActionableDefinition): ActionableState {
    throw new Error('SHOULD NOT HAPPEN');
  }
})('basic1', 'SimpleState', [askAction1, askAction2, pickAction]);

describe('ActionableState', () => {
  describe('execute action', () => {
    describe('when unknown message received', () => {
      it('throw "WRONG-ACTION"', () => {
        expect(() => state.execute(unknownAction)).toThrowError(
          errorMessages['WRONG-ACTION']
        );
      });
    });
  });
});

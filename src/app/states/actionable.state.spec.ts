import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActionableState } from './actionable.state';

const askAction1 = createActionableDefinition('ASK', 'ask1', 'May I help?');
const askAction2 = createActionableDefinition('ASK', 'ask2', 'Are you ok?');
const pickAction = createActionableDefinition(
  'PICK',
  'pickBubbleGum',
  'Get bubble gum'
);

const unknownAction = createActionableDefinition('CLOSE', 'error', 'unknown');

const state = new (class extends ActionableState {
  protected stateResult(_: ActionableDefinition): ActionableState {
    throw new Error('SHOULD NOT HAPPEN');
  }
})('SimpleState', [askAction1, askAction2, pickAction]);

describe('ActionableState', () => {
  describe('execute action', () => {
    describe('when unknown message received', () => {
      it('throw "WRONG-ACTION"', () => {
        expect(() => state.onResult(unknownAction, 'NONE')).toThrowError(
          errorMessages['WRONG-ACTION']
        );
      });
    });
  });

  describe('damage', () => {
    it('return null', () => {
      expect(state.damage(new ActionableEvent(askAction1, 'id1'))).toBeNull();
    });
  });
});

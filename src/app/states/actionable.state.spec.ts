import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { StateResult } from '../results/state.result';
import { ActionableState } from './actionable.state';

const askAction1 = actionableDefinitions['ASK'](
  'basic1',
  'ask1',
  'May I help?'
);
const askAction2 = actionableDefinitions['ASK'](
  'basic1',
  'ask2',
  'Are you ok?'
);
const pickAction = actionableDefinitions['PICK'](
  'basic1',
  'pickBubbleGum',
  'Get bubble gum'
);

const unknownAction = actionableDefinitions['CLOSE']('error', 'unknown');

const state = new (class extends ActionableState {
  protected stateResult(_: ActionableDefinition): StateResult {
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

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';

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
      expect(state.attack).toBeNull();
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

const unknownAction = createActionableDefinition('CLOSE', 'error', 'unknown');

const state = new (class extends ActionableState {
  protected override stateResult(
    _1: ActionableDefinition,
    _2: ResultLiteral,
    _3?: number
  ): { state: ActionableState; log?: string } {
    throw new Error('SHOULD NOT HAPPEN');
  }
})('SimpleState', [askAction1, askAction2, pickAction]);

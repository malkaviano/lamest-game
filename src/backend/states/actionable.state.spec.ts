import { createActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableState } from '@states/actionable.state';

describe('ActionableState', () => {
  describe('execute action', () => {
    describe('when unknown message received', () => {
      it('throw "WRONG-ACTION"', () => {
        expect(() => state.onResult(unknownAction, 'NONE', {})).toThrowError(
          GameStringsStore.errorMessages['WRONG-ACTION']
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
})('SimpleState', ArrayView.create(askAction1, askAction2, pickAction));

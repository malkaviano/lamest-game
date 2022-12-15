import { createActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { DiscardState } from './discard.state';

describe('DiscardState', () => {
  describe('stateResult', () => {
    it('return state without the action', () => {
      const result = state.onResult(knifeAction, 'NONE', {});

      const expected = new DiscardState(
        ArrayView.create([knifeAction, firstAidAction])
      );

      expect(result).toEqual({ state: expected, log: knifeAction.label });
    });
  });
});

const knifeAction = createActionableDefinition(
  'PICK',
  'knife',
  'Hunting Knife'
);

const firstAidAction = createActionableDefinition(
  'PICK',
  'firstAid',
  'First Aid Kit'
);

const state = new DiscardState(
  ArrayView.create([knifeAction, knifeAction, firstAidAction])
);

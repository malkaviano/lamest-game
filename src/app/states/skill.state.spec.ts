import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';
import { SimpleState } from './simple.state';
import { SkillState } from './skill.state';

describe('SkillState', () => {
  describe('when action succeeds', () => {
    it('return an empty state"', () => {
      const state = state1();

      const result = state.onResult(pickAction, 'SUCCESS');

      expect(result).toEqual(successState);
    });
  });

  describe('when action fails', () => {
    describe('when maximum tries was not reached', () => {
      it('return another TryState with tries 1"', () => {
        const state = state1();

        const result = state.onResult(pickAction, 'FAILURE');

        expect(result).toEqual(state2());
      });
    });

    describe('when maximum tries was reached', () => {
      it('return an empty state"', () => {
        let state = state1();

        state = state.onResult(pickAction, 'FAILURE');

        state = state.onResult(pickAction, 'FAILURE');

        expect(state).toEqual(emptyState);
      });
    });
  });

  describe('when skill was not rolled', () => {
    it('return the same state', () => {
      const state = state1();

      const result = state.onResult(pickAction, 'NONE');

      expect(result).toEqual(state);
    });
  });
});

const pickAction = createActionableDefinition(
  'PICK',
  'basic1',
  'pickBubbleGum',
  'Get bubble gum'
);

const successState = new SimpleState('basic1', [
  createActionableDefinition('ASK', 'ask1', 'askMeSecret', 'Whats the secret?'),
]);

const state1: () => ActionableState = () =>
  new SkillState('basic1', pickAction, successState, 2);

const state2 = () => new SkillState('basic1', pickAction, successState, 1);

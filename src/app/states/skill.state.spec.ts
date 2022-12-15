import { createActionableDefinition } from '../definitions/actionable.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';
import { SimpleState } from './simple.state';
import { SkillState } from './skill.state';

describe('SkillState', () => {
  describe('when action succeeds', () => {
    it('return an empty state"', () => {
      const { state } = state1().onResult(pickAction, 'SUCCESS', {});

      expect(state).toEqual(successState);
    });
  });

  describe('when action fails', () => {
    describe('when maximum tries was not reached', () => {
      it('return another TryState with tries 1"', () => {
        const state = state1();

        const result = state.onResult(pickAction, 'FAILURE', {});

        expect(result.state).toEqual(state2());
      });
    });

    describe('when maximum tries was reached', () => {
      it('return an empty state"', () => {
        let state = state1();

        state = state.onResult(pickAction, 'FAILURE', {}).state;

        state = state.onResult(pickAction, 'FAILURE', {}).state;

        expect(state).toEqual(emptyState);
      });
    });
  });

  describe('when skill was not rolled', () => {
    it('return the same state', () => {
      const state = state1();

      const result = state.onResult(pickAction, 'NONE', {});

      expect(result).toEqual({ state });
    });
  });
});

const pickAction = createActionableDefinition(
  'PICK',
  'pickBubbleGum',
  'Get bubble gum'
);

const successState = new SimpleState(
  ArrayView.create([
    createActionableDefinition(
      'INTERACTION',
      'askMeSecret',
      'Whats the secret?'
    ),
  ])
);

const f = () => successState;

const state1: () => ActionableState = () =>
  new SkillState(pickAction, new LazyHelper(f), 2);

const state2: () => ActionableState = () =>
  new SkillState(pickAction, new LazyHelper(f), 1);

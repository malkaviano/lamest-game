import { ArrayView } from '../views/array.view';
import {
  ConversationMessageMap,
  ConversationState,
} from './conversation.state';
import { createActionableDefinition } from '../definitions/actionable.definition';

const messageMap: ConversationMessageMap = {
  map1: {
    hello: {
      label: 'Hello',
      answer: 'Hi, how are you?',
    },
    die: {
      label: 'Die',
      answer: 'Nooooooooo',
      change: 'map2',
    },
  },
  map2: {
    sorry: {
      label: 'Sorry',
      answer: 'Plz do not kill me',
    },
  },
};

const helloAction = createActionableDefinition('ASK', 'id1', 'hello', 'Hello');
const dieAction = createActionableDefinition('ASK', 'id1', 'die', 'Die');
const sorryAction = createActionableDefinition('ASK', 'id1', 'sorry', 'Sorry');

const state = new ConversationState('id1', messageMap, 'map1');

describe('ConversationState', () => {
  it('should have action Hello', () => {
    expect(state.actions).toEqual(new ArrayView([helloAction, dieAction]));
  });

  describe('message context', () => {
    describe('when message Hello is received', () => {
      it('keep context', () => {
        const result = state.onResult(helloAction, 'NONE');

        expect(result.actions).toEqual(new ArrayView([helloAction, dieAction]));
      });
    });

    describe('when message Die is received', () => {
      it('change context', () => {
        const result = state.onResult(dieAction, 'NONE');

        expect(result.actions).toEqual(new ArrayView([sorryAction]));
      });
    });
  });
});

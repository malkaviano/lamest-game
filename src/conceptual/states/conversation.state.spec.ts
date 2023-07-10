import { ArrayView } from '@wrappers/array.view';
import { ConversationState } from './conversation.state';
import { createActionableDefinition } from '@definitions/actionable.definition';
import { MessageMapDefinition } from '@definitions/message-map.definition';

describe('ConversationState', () => {
  it('should have action Hello', () => {
    expect(state.actions).toEqual(ArrayView.create(helloAction, dieAction));
  });

  describe('message context', () => {
    describe('when message Hello is received', () => {
      it('keep context', () => {
        const result = state.onResult(helloAction, 'NONE', {});

        expect(result.state.actions).toEqual(
          ArrayView.create(helloAction, dieAction)
        );
      });
    });

    describe('when message Die is received', () => {
      it('change context', () => {
        const result = state.onResult(dieAction, 'NONE', {});

        expect(result.state.actions).toEqual(ArrayView.create(sorryAction));
      });
    });
  });
});

const messageMap: MessageMapDefinition = {
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

const helloAction = createActionableDefinition('INTERACTION', 'hello', 'Hello');
const dieAction = createActionableDefinition('INTERACTION', 'die', 'Die');
const sorryAction = createActionableDefinition('INTERACTION', 'sorry', 'Sorry');

const state = new ConversationState(messageMap, 'map1');

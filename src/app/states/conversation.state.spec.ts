import { first } from 'rxjs';

import { actionableDefinitions } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { LogMessage } from '../definitions/log-message.definition';
import {
  ConversationMessageMap,
  ConversationState,
} from './conversation.state';

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

const helloAction = actionableDefinitions['ASK']('id1', 'hello', 'Hello');
const dieAction = actionableDefinitions['ASK']('id1', 'die', 'Die');
const sorryAction = actionableDefinitions['ASK']('id1', 'sorry', 'Sorry');

const state = new ConversationState('id1', messageMap, 'map1');

describe('ConversationState', () => {
  it('should have action Hello', () => {
    expect(state.actions).toEqual(new ArrayView([helloAction, dieAction]));
  });

  describe(`when receiving hello`, () => {
    it('produces log "Hi, how are you?"', (done) => {
      const expectedLogMessage = new LogMessage(
        helloAction,
        'Hi, how are you?'
      );

      state.logMessageProduced$.pipe(first()).subscribe((log) => {
        expect(log).toEqual(expectedLogMessage);

        done();
      });

      state.execute(helloAction);
    });
  });

  describe('message context', () => {
    describe('when message Hello is received', () => {
      it('keep context', () => {
        const result = state.execute(helloAction);

        expect(result.actions).toEqual(new ArrayView([helloAction, dieAction]));
      });
    });

    describe('when message Die is received', () => {
      it('change context', () => {
        const result = state.execute(dieAction);

        expect(result.actions).toEqual(new ArrayView([sorryAction]));
      });
    });
  });

  describe('when receiving an unknown message', () => {
    it(`throws ${errorMessages['UNKNOWN-MESSAGE']}`, () => {
      expect(() =>
        state.execute(actionableDefinitions['ASK']('id1', 'unknown'))
      ).toThrowError(errorMessages['UNKNOWN-MESSAGE']);
    });
  });
});

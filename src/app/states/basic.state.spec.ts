import { actionableDefinitions } from '../definitions/actionable.definition';
import { ActionLogDefinition } from '../definitions/action-log.definition';
import { StateResult } from '../results/state.result';
import { BasicState } from './basic.state';

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

const state = new BasicState('basic1', [askAction1, askAction2, pickAction]);

describe('BasicState', () => {
  describe('execute action', () => {
    describe('when known message received', () => {
      it('return same state and log "executed"', () => {
        const result = state.execute(pickAction);

        const log = new ActionLogDefinition(pickAction.label, 'selected');

        const expected = new StateResult(state, log);

        expect(result).toEqual(expected);
      });
    });
  });
});

import { instance } from 'ts-mockito';

import { ActionPolicy } from './action.policy';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { LogMessageDefinition } from '@definitions/log-message.definition';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionAffect, actionableEvent } from '../../../tests/fakes';

describe('ActionPolicy', () => {
  const policy = new ActionPolicy();

  const actor = instance(mockedActorEntity);

  const target = instance(mockedPlayerEntity);

  const eventAffect = actionableEvent(actionAffect, target.id);

  beforeEach(() => {
    setupMocks();
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  [
    {
      ruleResult: {
        name: 'AFFECT',
        actor,
        event: eventAffect,
        target,
        result: 'EXECUTED',
      },
      expected: {
        actionPointsSpent: 3,
      },
      log: new LogMessageDefinition('AP', 'actor', 'spent 3 action points'),
    },
    {
      ruleResult: {
        name: 'AFFECT',
        actor,
        event: eventAffect,
        target,
        result: 'DENIED',
      },
      expected: {},
      log: undefined,
    },
  ].forEach(({ ruleResult, expected, log }) => {
    describe('enforce', () => {
      it('return AP spent', () => {
        const result = policy.enforce(ruleResult as RuleResultInterface);

        expect(result).toEqual(expected);
      });

      it('logs AP spent', (done) => {
        let result: LogMessageDefinition | undefined;

        policy.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        policy.enforce(ruleResult as RuleResultInterface);

        done();

        expect(result).toEqual(log);
      });
    });
  });
});

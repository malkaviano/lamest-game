import { instance } from 'ts-mockito';

import { ActionPolicy } from '@policies/action.policy';
import { RuleResult } from '@results/rule.result';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { affectActionable } from '@definitions/actionable.definition';

import { mockedPlayerEntity, setupMocks } from '../../../tests/mocks';
import { actionableEvent } from '../../../tests/fakes';

describe('ActionPolicy', () => {
  const policy = new ActionPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedPlayerEntity);

  const eventAffect = actionableEvent(affectActionable, target.id);

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
        dodged: true,
      },
      expected: {
        actorActionPointsSpent: 3,
        targetActionPointsSpent: 1,
      },
      log: [
        new LogMessageDefinition('AP', 'Some Name', 'spent 3 action points'),
        new LogMessageDefinition('AP', 'Some Name', 'spent 1 action points'),
      ],
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
      log: [],
    },
  ].forEach(({ ruleResult, expected, log }) => {
    describe('enforce', () => {
      it('return AP spent', () => {
        const result = policy.enforce(ruleResult as RuleResult);

        expect(result).toEqual(expected);
      });

      it('logs AP spent', (done) => {
        const result: LogMessageDefinition[] = [];

        policy.logMessageProduced$.subscribe((event) => {
          result.push(event);
        });

        policy.enforce(ruleResult as RuleResult);

        done();

        expect(result).toEqual(log);
      });
    });
  });
});

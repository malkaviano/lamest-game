import { instance, when } from 'ts-mockito';

import { StatusPolicy } from '@policies/status.policy';
import { affectActionable } from '@definitions/actionable.definition';
import { RuleResult } from '@results/rule.result';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionableEvent, simpleSword } from '../../../tests/fakes';
import { LogMessageDefinition } from '@definitions/log-message.definition';

describe('StatusPolicy', () => {
  const policy = new StatusPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedActorEntity);

  const eventAffect = actionableEvent(affectActionable, target.id);

  const logs = [new LogMessageDefinition('DIED', 'actor', 'is dead')];

  const ruleResult: RuleResult = {
    name: 'AFFECT',
    actor,
    event: eventAffect,
    target,
    result: 'EXECUTED',
    dodged: false,
    affected: simpleSword,
    effect: {
      amount: 4,
      type: simpleSword.damage.effectType,
    },
    skillName: simpleSword.skillName,
    roll: {
      result: 'SUCCESS',
      checkRoll: 1,
    },
  };

  beforeEach(() => {
    setupMocks();
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('when target is dead', () => {
    it('return dead policy result', () => {
      when(mockedActorEntity.situation).thenReturn('DEAD');

      const result = policy.enforce(ruleResult);

      expect(result).toEqual({ dead: target });
    });

    it('log actor is dead', () => {
      const result: LogMessageDefinition[] = [];

      when(mockedActorEntity.situation).thenReturn('DEAD');

      policy.logMessageProduced$.subscribe((event) => {
        result.push(event);
      });

      policy.enforce(ruleResult);

      expect(result).toEqual(logs);
    });
  });
});

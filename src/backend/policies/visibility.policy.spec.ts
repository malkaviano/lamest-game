import { instance, verify, when } from 'ts-mockito';

import { VisibilityPolicy } from './visibility.policy';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { VisibilityLiteral } from '@conceptual/literals/visibility.literal';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionAffect, actionableEvent } from '../../../tests/fakes';

describe('VisibilityPolicy', () => {
  const policy = new VisibilityPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedActorEntity);

  const eventAffect = actionableEvent(actionAffect, target.id);

  beforeEach(() => {
    setupMocks();
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('actor visibility', () => {
    describe('when using affect', () => {
      it('change visibility to VISIBLE', () => {
        const ruleResult: RuleResultInterface = {
          name: 'AFFECT',
          actor,
          event: eventAffect,
          target,
          result: 'EXECUTED',
        };

        when(mockedPlayerEntity.visibility).thenReturn('DISGUISED');

        const result = policy.enforce(ruleResult);

        verify(mockedPlayerEntity.changeVisibility('VISIBLE')).once();

        verify(mockedActorEntity.changeVisibility('VISIBLE')).never();

        expect(result).toEqual({
          visibility: { actor: 'VISIBLE' },
        });
      });
    });
  });

  describe('target visibility', () => {
    describe('when affected', () => {
      it('change visibility to VISIBLE', () => {
        const ruleResult: RuleResultInterface = {
          name: 'AFFECT',
          actor,
          event: eventAffect,
          target,
          result: 'EXECUTED',
          effect: {
            amount: 10,
            type: 'ACID',
          },
        };

        when(mockedPlayerEntity.visibility).thenReturn('VISIBLE');

        when(mockedActorEntity.visibility).thenReturn('HIDDEN');

        const result = policy.enforce(ruleResult);

        verify(mockedPlayerEntity.changeVisibility('VISIBLE')).never();

        verify(mockedActorEntity.changeVisibility('VISIBLE')).once();

        expect(result).toEqual({
          visibility: { target: 'VISIBLE' },
        });
      });
    });
  });

  [
    {
      actorVisibility: 'DISGUISED' as VisibilityLiteral,
      targetVisibility: 'HIDDEN' as VisibilityLiteral,
      expected: [
        new LogMessageDefinition(
          'VISIBILITY',
          'Some Name',
          'visibility changed to VISIBLE'
        ),
        new LogMessageDefinition(
          'VISIBILITY',
          'actor',
          'visibility changed to VISIBLE'
        ),
      ],
    },
    {
      actorVisibility: 'VISIBLE' as VisibilityLiteral,
      targetVisibility: 'VISIBLE' as VisibilityLiteral,
      expected: [],
    },
  ].forEach(({ actorVisibility, targetVisibility, expected }) => {
    it('should log', (done) => {
      const result: LogMessageDefinition[] = [];

      const ruleResult: RuleResultInterface = {
        name: 'AFFECT',
        actor,
        event: eventAffect,
        target,
        result: 'EXECUTED',
        effect: {
          amount: 10,
          type: 'ACID',
        },
      };

      when(mockedPlayerEntity.visibility).thenReturn(actorVisibility);

      when(mockedActorEntity.visibility).thenReturn(targetVisibility);

      policy.logMessageProduced$.subscribe((event) => {
        result.push(event);
      });

      policy.enforce(ruleResult);

      done();

      expect(result).toEqual(expected);
    });
  });
});

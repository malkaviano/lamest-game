import { instance, verify, when } from 'ts-mockito';

import { VisibilityPolicy } from '@policies/visibility.policy';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { VisibilityLiteral } from '@literals/visibility.literal';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionAffect,
  actionDetect,
  actionDisguise,
  actionHide,
  actionableEvent,
} from '../../../tests/fakes';

describe('VisibilityPolicy', () => {
  const policy = new VisibilityPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedActorEntity);

  const eventAffect = actionableEvent(actionAffect, target.id);

  const eventDetect = actionableEvent(actionDetect, target.id);

  const eventHide = actionableEvent(actionHide, actor.id);

  const eventDisguise = actionableEvent(actionDisguise, actor.id);

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

    describe('when passing skill check', () => {
      [
        {
          event: eventHide,
          skillName: eventHide.actionableDefinition.name,
          actorVisibility: 'HIDDEN' as VisibilityLiteral,
        },
        {
          event: eventDisguise,
          skillName: eventDisguise.actionableDefinition.name,
          actorVisibility: 'DISGUISED' as VisibilityLiteral,
        },
      ].forEach(({ event, skillName, actorVisibility }) => {
        it(`change actor visibility to ${actorVisibility}`, () => {
          const ruleResult: RuleResultInterface = {
            name: 'SKILL',
            actor,
            event,
            target,
            result: 'EXECUTED',
            skillName,
            roll: {
              result: 'SUCCESS',
              checkRoll: 10,
            },
          };

          const result = policy.enforce(ruleResult);

          verify(mockedPlayerEntity.changeVisibility(actorVisibility)).once();

          expect(result).toEqual({
            visibility: { actor: actorVisibility },
          });
        });
      });

      it('change target visibility to VISIBLE', () => {
        const ruleResult: RuleResultInterface = {
          name: 'SKILL',
          actor,
          event: eventDetect,
          target,
          result: 'EXECUTED',
          skillName: 'Detect',
          roll: {
            result: 'SUCCESS',
            checkRoll: 10,
          },
        };

        when(mockedActorEntity.visibility).thenReturn('HIDDEN');

        const result = policy.enforce(ruleResult);

        verify(mockedActorEntity.changeVisibility('VISIBLE')).once();

        expect(result).toEqual({
          visibility: { target: 'VISIBLE' },
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

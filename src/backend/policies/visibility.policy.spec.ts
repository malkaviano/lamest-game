import { instance, verify, when } from 'ts-mockito';

import { VisibilityPolicy } from '@policies/visibility.policy';
import { RuleResult } from '@results/rule.result';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { affectActionable } from '@definitions/actionable.definition';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { ArrayView } from '@wrappers/array.view';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionDetect,
  actionDisguise,
  actionHide,
  actionUseDiscardKey,
  actionableEvent,
  discardKey,
} from '../../../tests/fakes';

describe('VisibilityPolicy', () => {
  const policy = new VisibilityPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedActorEntity);

  const eventAffect = actionableEvent(affectActionable, target.id);

  const eventDetect = actionableEvent(actionDetect, target.id);

  const eventHide = actionableEvent(actionHide, actor.id);

  const eventDisguise = actionableEvent(actionDisguise, actor.id);

  const eventUseDiscardKey = actionableEvent(
    actionUseDiscardKey,
    discardKey.identity.name
  );

  beforeEach(() => {
    setupMocks();
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('actor visibility', () => {
    describe('when breaking disguise or stealth', () => {
      [
        {
          ruleResult: {
            name: 'AFFECT' as RuleNameLiteral,
            actor,
            event: eventAffect,
            target,
            result: 'EXECUTED' as RuleResultLiteral,
          },
          visibility: 'DISGUISED' as VisibilityLiteral,
        },
        {
          ruleResult: {
            name: 'SKILL' as RuleNameLiteral,
            actor,
            event: eventDetect,
            target,
            result: 'EXECUTED' as RuleResultLiteral,
            roll: { checkRoll: 2, result: 'SUCCESS' as CheckResultLiteral },
            skillName: 'Detect',
          },
          visibility: 'HIDDEN' as VisibilityLiteral,
        },
        {
          ruleResult: {
            name: 'USE' as RuleNameLiteral,
            actor,
            event: eventUseDiscardKey,
            target,
            result: 'EXECUTED' as RuleResultLiteral,
            used: discardKey,
          },
          visibility: 'HIDDEN' as VisibilityLiteral,
        },
      ].forEach(({ ruleResult, visibility }) => {
        it('change visibility to VISIBLE', () => {
          when(mockedPlayerEntity.visibility).thenReturn(visibility);

          const result = policy.enforce(ruleResult, {
            action: ruleResult.event.actionableDefinition,
            invisibleInteractives: ArrayView.empty(),
          });

          verify(mockedPlayerEntity.changeVisibility('VISIBLE')).once();

          expect(result).toEqual({
            visibility: { actor: 'VISIBLE', detected: ArrayView.empty() },
          });
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
          const ruleResult: RuleResult = {
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

          const result = policy.enforce(ruleResult, {
            action: event.actionableDefinition,
            invisibleInteractives: ArrayView.empty(),
          });

          verify(mockedPlayerEntity.changeVisibility(actorVisibility)).once();

          expect(result).toEqual({
            visibility: { actor: actorVisibility, detected: ArrayView.empty() },
          });
        });
      });

      it('change target visibility to VISIBLE', () => {
        const ruleResult: RuleResult = {
          name: 'SKILL',
          actor,
          event: eventDetect,
          target: actor,
          result: 'EXECUTED',
          skillName: 'Detect',
          roll: {
            result: 'SUCCESS',
            checkRoll: 10,
          },
        };

        when(mockedActorEntity.visibility).thenReturn('HIDDEN');

        const result = policy.enforce(ruleResult, {
          action: eventDetect.actionableDefinition,
          invisibleInteractives: ArrayView.create(target),
        });

        verify(mockedActorEntity.changeVisibility('VISIBLE')).once();

        expect(result).toEqual({
          visibility: {
            detected: ArrayView.create(target.id),
          },
        });
      });
    });
  });

  describe('target visibility', () => {
    describe('when affected', () => {
      it('change visibility to VISIBLE', () => {
        const ruleResult: RuleResult = {
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

        const result = policy.enforce(ruleResult, {
          action: eventAffect.actionableDefinition,
          invisibleInteractives: ArrayView.empty(),
        });

        verify(mockedPlayerEntity.changeVisibility('VISIBLE')).never();

        verify(mockedActorEntity.changeVisibility('VISIBLE')).once();

        expect(result).toEqual({
          visibility: { target: 'VISIBLE', detected: ArrayView.empty() },
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

      const ruleResult: RuleResult = {
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

      policy.enforce(ruleResult, {
        action: eventAffect.actionableDefinition,
        invisibleInteractives: ArrayView.empty(),
      });

      done();

      expect(result).toEqual(expected);
    });
  });
});

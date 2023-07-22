import { anything, instance, when } from 'ts-mockito';

import { EffectPolicy } from '@policies/effect.policy';
import {
  affectActionable,
  consumeActionable,
} from '@definitions/actionable.definition';
import { unarmedWeapon } from '@behaviors/equipment.behavior';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { EffectEvent } from '@events/effect.event';
import { ArrayView } from '@wrappers/array.view';

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionableEvent, consumableAnalgesic } from '../../../tests/fakes';

describe('EffectPolicy', () => {
  const policy = new EffectPolicy();

  const actor = instance(mockedPlayerEntity);

  const target = instance(mockedActorEntity);

  beforeEach(() => {
    setupMocks();

    when(
      mockedActorEntity.reactTo(affectActionable, 'SUCCESS', anything())
    ).thenReturn('received 1 KINETIC damage');

    when(
      mockedPlayerEntity.reactTo(consumeActionable, 'NONE', anything())
    ).thenReturn('HP did not change and EP did not change');
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('enforce', () => {
    [
      {
        ruleResult: {
          name: 'AFFECT' as RuleNameLiteral,
          result: 'EXECUTED' as RuleResultLiteral,
          event: actionableEvent(affectActionable, target.id),
          actor,
          target,
          effect: {
            amount: 1,
            type: unarmedWeapon.damage.effectType,
          },
          affected: unarmedWeapon,
          skillName: 'Brawl',
          roll: {
            checkRoll: 4,
            result: 'SUCCESS' as CheckResultLiteral,
          },
        },
        expected: {
          affected: target,
        },
        logs: [
          new LogMessageDefinition(
            'AFFECTED',
            'actor',
            'received 1 KINETIC damage'
          ),
        ],
      },
      {
        ruleResult: {
          name: 'AFFECT' as RuleNameLiteral,
          result: 'DENIED' as RuleResultLiteral,
          event: actionableEvent(affectActionable, target.id),
          actor,
          target,
          skillName: 'Brawl',
        },
        expected: {},
        logs: [],
      },
      {
        ruleResult: {
          name: 'CONSUME' as RuleNameLiteral,
          result: 'EXECUTED' as RuleResultLiteral,
          event: actionableEvent(consumeActionable, actor.id),
          actor,
          consumable: {
            consumed: consumableAnalgesic,
            effect: new EffectEvent(
              consumableAnalgesic.effect,
              consumableAnalgesic.hp
            ),
            energy: consumableAnalgesic.energy,
          },
        },
        expected: {
          affected: actor,
        },
        logs: [
          new LogMessageDefinition(
            'AFFECTED',
            'Some Name',
            'HP did not change and EP did not change'
          ),
        ],
      },
    ].forEach(({ ruleResult, expected, logs }) => {
      it('return effect result', () => {
        const result = policy.enforce(ruleResult, {
          action: ruleResult.event.actionableDefinition,
          invisibleInteractives: ArrayView.empty(),
        });

        expect(result).toEqual(expected);
      });

      it('log interactive response', () => {
        const result: LogMessageDefinition[] = [];

        policy.logMessageProduced$.subscribe((event) => {
          result.push(event);
        });

        policy.enforce(ruleResult, {
          action: ruleResult.event.actionableDefinition,
          invisibleInteractives: ArrayView.empty(),
        });

        expect(result).toEqual(logs);
      });
    });
  });
});

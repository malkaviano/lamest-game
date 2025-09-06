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

import {
  mockedActorEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionableEvent, consumableAnalgesic } from '../../../tests/fakes';
import { testPolicy } from '../../../tests/scenarios';
import { CombatEvent } from '@interfaces/combat-event.interface';
import { RuleResult } from '@results/rule.result';

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
      testPolicy(policy, ruleResult, expected, logs);
    });

    it('emits combat event on AFFECT EXECUTED', (done) => {
      const ruleResult = {
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
      };

      let received: CombatEvent | undefined;
      policy.combatEventProduced$.subscribe((ev) => (received = ev));

      policy.enforce(ruleResult as unknown as RuleResult);

      expect(received).toEqual(
        jasmine.objectContaining({
          category: 'AFFECTED',
          actorName: 'Some Name',
          targetName: 'actor',
          effectType: 'KINETIC',
          amount: 1,
          outcome: 'HIT',
          timestamp: jasmine.any(Number),
        })
      );
      done();
    });

    it('emits HEAL event on CONSUME EXECUTED', (done) => {
      const ruleResult = {
        name: 'CONSUME' as RuleNameLiteral,
        result: 'EXECUTED' as RuleResultLiteral,
        event: actionableEvent(consumeActionable, actor.id),
        actor,
        consumable: {
          consumed: consumableAnalgesic,
          hp: consumableAnalgesic.hp,
          energy: consumableAnalgesic.energy,
        },
      };

      let received: CombatEvent | undefined;
      policy.combatEventProduced$.subscribe((ev) => (received = ev));

      policy.enforce(ruleResult as unknown as RuleResult);

      expect(received).toEqual(
        jasmine.objectContaining({
          category: 'AFFECTED',
          actorName: 'Some Name',
          targetName: 'Some Name',
          amount: consumableAnalgesic.hp,
          outcome: 'HEAL',
          timestamp: jasmine.any(Number),
        })
      );
      done();
    });

    it('emits MISS on AVOIDED (not dodged)', (done) => {
      const ruleResult = {
        name: 'AFFECT' as RuleNameLiteral,
        result: 'AVOIDED' as RuleResultLiteral,
        event: actionableEvent(affectActionable, target.id),
        actor,
        target,
        dodged: false,
      };

      let received: CombatEvent | undefined;
      policy.combatEventProduced$.subscribe((ev) => (received = ev));

      policy.enforce(ruleResult as unknown as RuleResult);

      expect(received).toEqual(
        jasmine.objectContaining({
          outcome: 'MISS',
          actorName: 'Some Name',
          targetName: 'actor',
          timestamp: jasmine.any(Number),
        })
      );
      done();
    });

    it('emits DODGE on AVOIDED (dodged)', (done) => {
      const ruleResult = {
        name: 'AFFECT' as RuleNameLiteral,
        result: 'AVOIDED' as RuleResultLiteral,
        event: actionableEvent(affectActionable, target.id),
        actor,
        target,
        dodged: true,
      };

      let received: CombatEvent | undefined;
      policy.combatEventProduced$.subscribe((ev) => (received = ev));

      policy.enforce(ruleResult as unknown as RuleResult);

      expect(received).toEqual(
        jasmine.objectContaining({
          outcome: 'DODGE',
          actorName: 'Some Name',
          targetName: 'actor',
          timestamp: jasmine.any(Number),
        })
      );
      done();
    });
  });
});

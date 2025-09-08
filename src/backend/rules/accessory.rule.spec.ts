import { instance, when } from 'ts-mockito';

import { AccessoryRule } from '@rules/accessory.rule';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';

import {
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRpgService,
  setupMocks,
} from '../../../tests/mocks';
import {
  playerInfo,
  interactiveInfo,
  actionUseDiscardKey,
  discardKey,
  actionableEvent,
  heroDisguise,
  actionUseHeroDisguise,
  actorInfo,
  actionUsePermanentKey,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

const eventUseDiscardKey = actionableEvent(
  actionUseDiscardKey,
  interactiveInfo.id
);

const eventUseHeroDisguise = actionableEvent(
  actionUseHeroDisguise,
  actorInfo.id
);

const eventUsePermanentKey = actionableEvent(
  actionUsePermanentKey,
  interactiveInfo.id
);

describe('AccessoryRule', () => {
  let rule: AccessoryRule;

  const notFoundLog = new LogMessageDefinition(
    'NOT-FOUND',
    playerInfo.name,
    'Permanent Key failed, required item was not found in inventory'
  );

  const actor = instance(mockedPlayerEntity);

  const extras = {
    target: instance(mockedInteractiveEntity),
  };

  beforeEach(() => {
    setupMocks();

    rule = new AccessoryRule(
      instance(mockedInventoryService),
      instance(mockedRpgService)
    );

    when(
      mockedInventoryService.look(actor.id, heroDisguise.identity.name)
    ).thenReturn(heroDisguise);

    when(
      mockedInventoryService.look(actor.id, discardKey.identity.name)
    ).thenReturn(discardKey);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item could not be found', () => {
      it('should log item not found', (done) => {
        ruleScenario(
          rule,
          actor,
          eventUsePermanentKey,
          extras,
          [notFoundLog],
          done
        );
      });
    });

    describe('when item was found', () => {
      [
        {
          event: eventUsePermanentKey,
          target: instance(mockedInteractiveEntity),
          expected: {
            name: 'ACCESSORY' as RuleNameLiteral,
            event: eventUsePermanentKey,
            result: 'DENIED' as RuleResultLiteral,
            actor,
            target: actor,
          },
        },
        {
          event: eventUseDiscardKey,
          target: instance(mockedInteractiveEntity),
          expected: {
            name: 'ACCESSORY' as RuleNameLiteral,
            event: eventUseDiscardKey,
            result: 'EXECUTED' as RuleResultLiteral,
            actor,
            target: actor,
            used: discardKey,
          },
        },
        {
          event: eventUseHeroDisguise,
          target: instance(mockedPlayerEntity),
          expected: {
            name: 'ACCESSORY' as RuleNameLiteral,
            event: eventUseHeroDisguise,
            result: 'EXECUTED' as RuleResultLiteral,
            actor,
            target: instance(mockedPlayerEntity),
            used: heroDisguise,
            skillName: heroDisguise.skillName,
            roll: {
              checkRoll: 7,
              result: 'SUCCESS' as CheckResultLiteral,
            },
          },
        },
        {
          event: eventUseHeroDisguise,
          target: instance(mockedPlayerEntity),
          expected: {
            name: 'ACCESSORY' as RuleNameLiteral,
            event: eventUseHeroDisguise,
            result: 'AVOIDED' as RuleResultLiteral,
            actor,
            target: instance(mockedPlayerEntity),
            used: heroDisguise,
            skillName: heroDisguise.skillName,
            roll: {
              checkRoll: 78,
              result: 'FAILURE' as CheckResultLiteral,
            },
          },
        },
      ].forEach(({ event, expected }) => {
        it('return used result', () => {
          when(mockedRpgService.actorSkillCheck(actor, 'Disguise')).thenReturn({
            result: expected.roll?.result ?? 'FAILURE',
            roll: expected.roll?.checkRoll ?? 100,
          });

          const result = rule.execute(actor, event);

          expect(result).toEqual(expected);
        });
      });

      it('defaults target to actor when none provided (self-use)', () => {
        // For disguises (USABLE with skillName), if no target is provided, the rule should default to the actor
        when(mockedRpgService.actorSkillCheck(actor, 'Disguise')).thenReturn({
          result: 'SUCCESS',
          roll: 7,
        });

        const result = rule.execute(actor, eventUseHeroDisguise);

        expect(result).toEqual({
          name: 'ACCESSORY' as RuleNameLiteral,
          event: eventUseHeroDisguise,
          result: 'EXECUTED' as RuleResultLiteral,
          actor,
          target: actor,
          used: heroDisguise,
          skillName: heroDisguise.skillName,
          roll: {
            checkRoll: 7,
            result: 'SUCCESS' as CheckResultLiteral,
          },
        });
      });

      it('defaults target to actor and returns AVOIDED on failure (self-use)', () => {
        when(mockedRpgService.actorSkillCheck(actor, 'Disguise')).thenReturn({
          result: 'FAILURE',
          roll: 78,
        });

        const result = rule.execute(actor, eventUseHeroDisguise);

        expect(result).toEqual({
          name: 'ACCESSORY' as RuleNameLiteral,
          event: eventUseHeroDisguise,
          result: 'AVOIDED' as RuleResultLiteral,
          actor,
          target: actor,
          used: heroDisguise,
          skillName: heroDisguise.skillName,
          roll: {
            checkRoll: 78,
            result: 'FAILURE' as CheckResultLiteral,
          },
        });
      });

      it('always targets actor and executes when no skillName', () => {
        const result = rule.execute(actor, eventUseDiscardKey);

        expect(result).toEqual({
          name: 'ACCESSORY' as RuleNameLiteral,
          event: eventUseDiscardKey,
          result: 'EXECUTED' as RuleResultLiteral,
          actor,
          target: actor,
          used: discardKey,
        });
      });
    });
  });
});

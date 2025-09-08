import { instance, when } from 'ts-mockito';

import { UseRule } from '@rules/use.rule';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { createActionableDefinition } from '@definitions/actionable.definition';

import {
  mockedCheckedService,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRpgService,
  setupMocks,
} from '../../../tests/mocks';
import {
  playerInfo,
  interactiveInfo,
  actionableEvent,
  heroDisguise,
  discardKey,
  permanentKey,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

const actionAccessoryDiscardKey = createActionableDefinition(
  'USE',
  discardKey.identity.name,
  discardKey.identity.label
);

const eventAccessoryDiscardKey = actionableEvent(
  actionAccessoryDiscardKey,
  interactiveInfo.id
);

const actionAccessoryHeroDisguise = createActionableDefinition(
  'USE',
  heroDisguise.identity.name,
  heroDisguise.identity.label
);

const eventAccessoryHeroDisguise = actionableEvent(
  actionAccessoryHeroDisguise,
  interactiveInfo.id
);

const actionAccessoryPermanentKey = createActionableDefinition(
  'USE',
  permanentKey.identity.name,
  permanentKey.identity.label
);

const eventAccessoryPermanentKey = actionableEvent(
  actionAccessoryPermanentKey,
  interactiveInfo.id
);

describe('UseRule', () => {
  let rule: UseRule;

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

    rule = new UseRule(
      instance(mockedInventoryService),
      instance(mockedCheckedService),
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
          eventAccessoryPermanentKey,
          extras,
          [notFoundLog],
          done
        );
      });
    });

    describe('when item was found', () => {
      [
        {
          event: eventAccessoryDiscardKey,
          target: instance(mockedInteractiveEntity),
          expected: {
            name: 'USE' as RuleNameLiteral,
            event: eventAccessoryDiscardKey,
            result: 'EXECUTED' as RuleResultLiteral,
            actor,
            target: instance(mockedInteractiveEntity),
            used: discardKey,
          },
        },
        {
          event: eventAccessoryHeroDisguise,
          target: instance(mockedInteractiveEntity),
          expected: {
            name: 'USE' as RuleNameLiteral,
            event: eventAccessoryHeroDisguise,
            result: 'EXECUTED' as RuleResultLiteral,
            actor,
            target: instance(mockedInteractiveEntity),
            used: heroDisguise,
            skillName: heroDisguise.skillName,
            roll: {
              checkRoll: 7,
              result: 'SUCCESS' as CheckResultLiteral,
            },
          },
        },
        {
          event: eventAccessoryHeroDisguise,
          target: instance(mockedInteractiveEntity),
          expected: {
            name: 'USE' as RuleNameLiteral,
            event: eventAccessoryHeroDisguise,
            result: 'AVOIDED' as RuleResultLiteral,
            actor,
            target: instance(mockedInteractiveEntity),
            used: heroDisguise,
            skillName: heroDisguise.skillName,
            roll: {
              checkRoll: 78,
              result: 'FAILURE' as CheckResultLiteral,
            },
          },
        },
      ].forEach(({ event, target, expected }) => {
        it('return accessory result', () => {
          when(mockedRpgService.actorSkillCheck(actor, 'Disguise')).thenReturn({
            result: expected.roll?.result ?? 'FAILURE',
            roll: expected.roll?.checkRoll ?? 100,
          });

          const result = rule.execute(actor, event, { target });

          expect(result).toEqual(expected);
        });
      });
    });
  });
});

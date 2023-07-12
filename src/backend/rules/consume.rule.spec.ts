import { instance, when } from 'ts-mockito';

import { GameStringsStore } from '@stores/game-strings.store';
import { ConsumeRule } from '@rules/consume.rule';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RollDefinition } from '@definitions/roll.definition';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

import {
  mockedCheckedService,
  mockedGamePredicate,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRollHelper,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionConsume,
  consumableFirstAid,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('ConsumeRule', () => {
  let rule: ConsumeRule;

  beforeEach(() => {
    setupMocks();

    rule = new ConsumeRule(
      instance(mockedInventoryService),
      instance(mockedRollHelper),
      instance(mockedCheckedService),
      instance(mockedGamePredicate)
    );

    when(
      mockedCheckedService.lookItemOrThrow<ConsumableDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        simpleSword.identity.name
      )
    ).thenThrow(new Error(GameStringsStore.errorMessages['WRONG-ITEM']));

    when(
      mockedCheckedService.lookItemOrThrow<ConsumableDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        consumableFirstAid.identity.name
      )
    ).thenReturn(consumableFirstAid);

    when(mockedGamePredicate.canUseSkill(actor, 'First Aid')).thenReturn(true);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a consumable', () => {
      it('throw Wrong item was used', () => {
        expect(() =>
          rule.execute(
            instance(mockedPlayerEntity),
            actionableEvent(actionConsume, simpleSword.identity.name)
          )
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a consumable', () => {
      it('should log item consume', (done) => {
        when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
          successFirstAidRoll
        );

        ruleScenario(
          rule,
          actor,
          eventConsumeFirstAid,
          {},
          [consumedFirstAidLog],
          done
        );
      });

      describe('when skill check passes', () => {
        it('return consumed result', () => {
          when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
            successFirstAidRoll
          );

          const result = rule.execute(actor, eventConsumeFirstAid);

          const expected: RuleResultInterface = {
            name: 'CONSUME',
            event: eventConsumeFirstAid,
            actor,
            result: 'EXECUTED',
            skillName: 'First Aid',
            roll: { checkRoll: successFirstAidRoll.roll, result: 'SUCCESS' },
            consumable: {
              consumed: consumableFirstAid,
              hp: 5,
              energy: 2,
            },
          };

          expect(result).toEqual(expected);
        });
      });

      describe('when skill check failed', () => {
        it('return consumed result with half effect', () => {
          when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
            failureFirstAidRoll
          );

          const result = rule.execute(actor, eventConsumeFirstAid);

          const expected: RuleResultInterface = {
            name: 'CONSUME',
            event: eventConsumeFirstAid,
            actor,
            result: 'EXECUTED',
            skillName: 'First Aid',
            roll: { checkRoll: failureFirstAidRoll.roll, result: 'FAILURE' },
            consumable: {
              consumed: consumableFirstAid,
              hp: 2,
              energy: 1,
            },
          };

          expect(result).toEqual(expected);
        });
      });

      describe('when skill could not be checked', () => {
        it('return denied result', () => {
          when(mockedGamePredicate.canUseSkill(actor, 'First Aid')).thenReturn(
            false
          );

          const result = rule.execute(actor, eventConsumeFirstAid);

          const expected: RuleResultInterface = {
            name: 'CONSUME',
            event: eventConsumeFirstAid,
            actor,
            result: 'DENIED',
            skillName: 'First Aid',
          };

          expect(result).toEqual(expected);
        });
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const successFirstAidRoll = new RollDefinition('SUCCESS', 10);

const failureFirstAidRoll = new RollDefinition('FAILURE', 90);

const consumedFirstAidLog = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  'consumed First Aid Kit'
);

const eventConsumeFirstAid = actionableEvent(
  actionConsume,
  consumableFirstAid.identity.name
);

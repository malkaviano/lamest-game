import { EMPTY } from 'rxjs';
import { instance, when } from 'ts-mockito';

import { GameStringsStore } from '../../stores/game-strings.store';
import { ConsumeRule } from './consume.rule';
import { ConsumableDefinition } from '../../core/definitions/consumable.definition';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

import {
  mockedAffectedAxiom,
  mockedCheckedService,
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
  const rule = new ConsumeRule(
    instance(mockedInventoryService),
    instance(mockedRollHelper),
    instance(mockedCheckedService),
    instance(mockedAffectedAxiom)
  );

  beforeEach(() => {
    setupMocks();

    when(mockedAffectedAxiom.logMessageProduced$).thenReturn(EMPTY);

    when(
      mockedCheckedService.lookItemOrThrow<ConsumableDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        simpleSword.identity.name
      )
    ).thenThrow(new Error(GameStringsStore.errorMessages['WRONG-ITEM']));

    when(
      mockedCheckedService.takeItemOrThrow<ConsumableDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        consumableFirstAid.identity.name
      )
    ).thenReturn(consumableFirstAid);

    when(
      mockedCheckedService.lookItemOrThrow<ConsumableDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        consumableFirstAid.identity.name
      )
    ).thenReturn(consumableFirstAid);
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
          [consumedFirstAidLog, lostFirstAidLog],
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
            event: eventConsumeFirstAid,
            actor,
            result: 'CONSUMED',
            skill: { name: 'First Aid', roll: successFirstAidRoll.roll },
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
            event: eventConsumeFirstAid,
            actor,
            result: 'CONSUMED',
            skill: { name: 'First Aid', roll: failureFirstAidRoll.roll },
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
        it('should log item consume', (done) => {
          when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
            impossibleFirstAidRoll
          );

          ruleScenario(rule, actor, eventConsumeFirstAid, {}, [], done);
        });

        it('return denied result', () => {
          when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
            impossibleFirstAidRoll
          );

          const result = rule.execute(actor, eventConsumeFirstAid);

          const expected: RuleResultInterface = {
            event: eventConsumeFirstAid,
            actor,
            result: 'DENIED',
            skill: { name: 'First Aid', roll: 0 },
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

const impossibleFirstAidRoll = new RollDefinition('IMPOSSIBLE', 0);

const consumedFirstAidLog = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  'consumed First Aid Kit'
);

const lostFirstAidLog = new LogMessageDefinition(
  'LOST',
  playerInfo.name,
  'lost First Aid Kit'
);

const eventConsumeFirstAid = actionableEvent(
  actionConsume,
  consumableFirstAid.identity.name
);

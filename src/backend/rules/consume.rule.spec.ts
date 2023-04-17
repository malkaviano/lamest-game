import { EMPTY } from 'rxjs';
import { deepEqual, instance, when } from 'ts-mockito';

import { GameStringsStore } from '../../stores/game-strings.store';
import { ConsumeRule } from './consume.rule';
import { ConsumableDefinition } from '../../core/definitions/consumable.definition';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { EffectEvent } from '../../core/events/effect.event';

import {
  mockedAffectedAxiomService,
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
    instance(mockedAffectedAxiomService)
  );

  beforeEach(() => {
    setupMocks();

    when(mockedAffectedAxiomService.logMessageProduced$).thenReturn(EMPTY);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a consumable', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedCheckedService.lookItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenThrow(new Error(GameStringsStore.errorMessages['WRONG-ITEM']));

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

      describe('when skill check failed', () => {
        it('should should receive half effect', () => {
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

          when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
            failureFirstAidRoll
          );

          let result = false;

          when(
            mockedAffectedAxiomService.affectWith(
              actor,
              eventConsumeFirstAid.actionableDefinition,
              failureFirstAidRoll.result,
              deepEqual({
                effect: new EffectEvent(
                  consumableFirstAid.effect,
                  Math.trunc(consumableFirstAid.hp / 2)
                ),
                energy: Math.trunc(consumableFirstAid.energy / 2),
              })
            )
          ).thenCall(() => {
            result = true;
          });

          rule.execute(actor, eventConsumeFirstAid);

          expect(result).toEqual(true);
        });
      });

      describe('when skill could not be checked', () => {
        it('should log item consume', (done) => {
          when(
            mockedCheckedService.lookItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
          ).thenReturn(consumableFirstAid);

          when(mockedRollHelper.actorSkillCheck(actor, 'First Aid')).thenReturn(
            impossibleFirstAidRoll
          );

          ruleScenario(rule, actor, eventConsumeFirstAid, {}, [], done);
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

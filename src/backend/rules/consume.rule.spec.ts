import { TestBed } from '@angular/core/testing';

import { EMPTY } from 'rxjs';
import { deepEqual, instance, when } from 'ts-mockito';

import { GameStringsStore } from '../stores/game-strings.store';
import { InventoryService } from '../services/inventory.service';
import { ConsumeRule } from './consume.rule';
import { RollService } from '../services/roll.service';
import { CheckedHelper } from '../helpers/checked.helper';
import { ConsumableDefinition } from '../../core/definitions/consumable.definition';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { EffectEvent } from '../../core/events/effect.event';

import {
  mockedAffectedAxiomService,
  mockedCheckedHelper,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRollService,
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
  let service: ConsumeRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
        {
          provide: CheckedHelper,
          useValue: instance(mockedCheckedHelper),
        },
        {
          provide: AffectAxiomService,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    when(mockedAffectedAxiomService.logMessageProduced$).thenReturn(EMPTY);

    service = TestBed.inject(ConsumeRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a consumable', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedCheckedHelper.lookItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenThrow(new Error(GameStringsStore.errorMessages['WRONG-ITEM']));

        expect(() =>
          service.execute(
            instance(mockedPlayerEntity),
            actionableEvent(actionConsume, simpleSword.identity.name)
          )
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a consumable', () => {
      it('should log item consume', (done) => {
        when(
          mockedCheckedHelper.takeItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            consumableFirstAid.identity.name
          )
        ).thenReturn(consumableFirstAid);

        when(
          mockedCheckedHelper.lookItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            consumableFirstAid.identity.name
          )
        ).thenReturn(consumableFirstAid);

        when(mockedRollService.actorSkillCheck(actor, 'First Aid')).thenReturn(
          successFirstAidRoll
        );

        ruleScenario(
          service,
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
            mockedCheckedHelper.takeItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
          ).thenReturn(consumableFirstAid);

          when(
            mockedCheckedHelper.lookItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
          ).thenReturn(consumableFirstAid);

          when(
            mockedRollService.actorSkillCheck(actor, 'First Aid')
          ).thenReturn(failureFirstAidRoll);

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

          service.execute(actor, eventConsumeFirstAid);

          expect(result).toEqual(true);
        });
      });

      describe('when skill could not be checked', () => {
        it('should log item consume', (done) => {
          when(
            mockedCheckedHelper.lookItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
          ).thenReturn(consumableFirstAid);

          when(
            mockedRollService.actorSkillCheck(actor, 'First Aid')
          ).thenReturn(impossibleFirstAidRoll);

          ruleScenario(service, actor, eventConsumeFirstAid, {}, [], done);
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

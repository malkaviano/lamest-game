import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { errorMessages } from '../definitions/error-messages.definition';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createConsumedLogMessage,
  createFreeLogMessage,
  createHealedMessage,
} from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { ConsumeRule } from './consume.rule';
import { RollService } from '../services/roll.service';

import {
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRollService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionConsume,
  consumableAnalgesic,
  consumableFirstAid,
  eventConsumeAnalgesic,
  eventConsumeFirstAid,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { EffectReceivedDefinition } from '../definitions/effect-received.definition';

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
      ],
    });

    setupMocks();

    service = TestBed.inject(ConsumeRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a consumable', () => {
      it('throw Wrong item was used', () => {
        when(mockedInventoryService.take(playerInfo.id, 'sword')).thenReturn(
          simpleSword
        );

        expect(() =>
          service.execute(
            instance(mockedPlayerEntity),
            new ActionableEvent(actionConsume, 'sword')
          )
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });

    describe('when consumable has skill requirement', () => {
      describe('when skill check fails', () => {
        it('should not heal player', () => {
          when(
            mockedInventoryService.take(playerInfo.id, 'firstAid')
          ).thenReturn(consumableFirstAid);

          when(
            mockedRollService.actorSkillCheck(
              instance(mockedPlayerEntity),
              'First Aid'
            )
          ).thenReturn({
            result: 'FAILURE',
            roll: 100,
          });

          const result = service.execute(
            instance(mockedPlayerEntity),
            eventConsumeFirstAid
          );

          expect(result).toEqual({
            logs: [logFirstAid1, logFirstAidFailure],
          });
        });
      });

      describe('when skill check passes', () => {
        it('should heal player', () => {
          when(
            mockedInventoryService.take(playerInfo.id, 'firstAid')
          ).thenReturn(consumableFirstAid);

          when(
            mockedRollService.actorSkillCheck(
              instance(mockedPlayerEntity),
              'First Aid'
            )
          ).thenReturn({
            result: 'SUCCESS',
            roll: 10,
          });

          when(
            mockedPlayerEntity.reactTo(
              deepEqual(actionConsume),
              'SUCCESS',
              deepEqual({
                effect: new EffectReceivedDefinition('REMEDY', 5),
              })
            )
          ).thenReturn(logHeal5);

          const result = service.execute(
            instance(mockedPlayerEntity),
            eventConsumeFirstAid
          );

          expect(result).toEqual({
            logs: [logFirstAid1, logFirstAidSuccess, logFirstAid3],
          });
        });
      });

      describe('when actor skill value was 0', () => {
        it('should log error message', () => {
          when(mockedPlayerEntity.skills).thenReturn({ 'First Aid': 0 });

          when(
            mockedInventoryService.take(playerInfo.id, 'firstAid')
          ).thenReturn(consumableFirstAid);

          when(
            mockedRollService.actorSkillCheck(
              instance(mockedPlayerEntity),
              'First Aid'
            )
          ).thenReturn({
            result: 'IMPOSSIBLE',
            roll: 0,
          });

          const result = service.execute(
            instance(mockedPlayerEntity),
            eventConsumeFirstAid
          );

          expect(result).toEqual({
            logs: [logError],
          });
        });
      });
    });

    describe('when consumable has no skill requirement', () => {
      it('should heal player', () => {
        when(
          mockedInventoryService.take(
            playerInfo.id,
            consumableAnalgesic.identity.name
          )
        ).thenReturn(consumableAnalgesic);

        when(
          mockedPlayerEntity.reactTo(
            deepEqual(actionConsume),
            'NONE',
            deepEqual({
              effect: new EffectReceivedDefinition('REMEDY', 2),
            })
          )
        ).thenReturn(logHeal2);

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventConsumeAnalgesic
        );

        expect(result).toEqual({
          logs: [logAnalgesic1, logAnalgesic2],
        });
      });
    });
  });
});

const logAnalgesic1 = createConsumedLogMessage(
  playerInfo.name,
  consumableAnalgesic.identity.label
);

const logHeal2 = createHealedMessage(2, consumableAnalgesic.effect);

const logAnalgesic2 = createFreeLogMessage(playerInfo.name, logHeal2);

const logFirstAid1 = createConsumedLogMessage(playerInfo.name, 'First Aid Kit');

const logFirstAidSuccess = createCheckLogMessage(
  playerInfo.name,
  'First Aid',
  10,
  'SUCCESS'
);

const logHeal5 = createHealedMessage(5, consumableFirstAid.effect);

const logFirstAid3 = createFreeLogMessage(playerInfo.name, logHeal5);

const logFirstAidFailure = createCheckLogMessage(
  playerInfo.name,
  'First Aid',
  100,
  'FAILURE'
);

const logError = createCannotCheckLogMessage(playerInfo.name, 'First Aid');

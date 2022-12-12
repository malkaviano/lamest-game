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
  actionHeal,
  consumableChesseBurger,
  consumableFirstAid,
  eventConsumeCheeseBurger,
  eventConsumeFirstAid,
  simpleSword,
} from '../../../tests/fakes';

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
        when(mockedInventoryService.take('player', 'sword')).thenReturn(
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
          when(mockedInventoryService.take('player', 'firstAid')).thenReturn(
            consumableFirstAid
          );

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
          when(mockedInventoryService.take('player', 'firstAid')).thenReturn(
            consumableFirstAid
          );

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
              deepEqual(actionHeal),
              'SUCCESS',
              deepEqual({
                heal: 5,
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

          when(mockedInventoryService.take('player', 'firstAid')).thenReturn(
            consumableFirstAid
          );

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
        when(mockedInventoryService.take('player', 'sandwich')).thenReturn(
          consumableChesseBurger
        );

        when(
          mockedPlayerEntity.reactTo(
            deepEqual(actionHeal),
            'NONE',
            deepEqual({ heal: 2 })
          )
        ).thenReturn(logHeal2);

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventConsumeCheeseBurger
        );

        expect(result).toEqual({
          logs: [logCheeseBurger1, logCheeseBurger2],
        });
      });
    });
  });
});

const logCheeseBurger1 = createConsumedLogMessage('player', 'Cheeseburger');

const logHeal2 = createHealedMessage(2);

const logCheeseBurger2 = createFreeLogMessage('player', logHeal2);

const logFirstAid1 = createConsumedLogMessage('player', 'First Aid Kit');

const logFirstAidSuccess = createCheckLogMessage(
  'player',
  'First Aid',
  10,
  'SUCCESS'
);

const logHeal5 = createHealedMessage(5);

const logFirstAid3 = createFreeLogMessage('player', logHeal5);

const logFirstAidFailure = createCheckLogMessage(
  'player',
  'First Aid',
  100,
  'FAILURE'
);

const logError = createCannotCheckLogMessage('player', 'First Aid');

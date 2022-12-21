import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { errorMessages } from '../definitions/error-messages.definition';
import { InventoryService } from '../services/inventory.service';
import { ConsumeRule } from './consume.rule';
import { RollService } from '../services/roll.service';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ConsumableDefinition } from '../definitions/consumable.definition';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

import {
  mockedExtractorHelper,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedRollService,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionConsume,
  consumableAnalgesic,
  consumableFirstAid,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

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
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createConsumedLogMessage(
        playerInfo.name,
        consumableAnalgesic.identity.label
      )
    ).thenReturn(logAnalgesic1);

    when(
      mockedStringMessagesStoreService.createEffectRestoredHPMessage(
        consumableAnalgesic.effect,
        '2'
      )
    ).thenReturn(logHeal2);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'CONSUMED',
        playerInfo.name,
        logHeal2
      )
    ).thenReturn(logAnalgesic2);

    when(
      mockedStringMessagesStoreService.createConsumedLogMessage(
        playerInfo.name,
        'First Aid Kit'
      )
    ).thenReturn(logFirstAid1);

    when(
      mockedStringMessagesStoreService.createSkillCheckLogMessage(
        playerInfo.name,
        'First Aid',
        '10',
        'SUCCESS'
      )
    ).thenReturn(logFirstAidSuccess);

    when(
      mockedStringMessagesStoreService.createEffectRestoredHPMessage(
        consumableFirstAid.effect,
        '5'
      )
    ).thenReturn(logHeal5);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'CONSUMED',
        playerInfo.name,
        logHeal5
      )
    ).thenReturn(logFirstAid3);

    when(
      mockedStringMessagesStoreService.createSkillCheckLogMessage(
        playerInfo.name,
        'First Aid',
        '100',
        'FAILURE'
      )
    ).thenReturn(logFirstAidFailure);

    when(
      mockedStringMessagesStoreService.createCannotCheckSkillLogMessage(
        playerInfo.name,
        'First Aid'
      )
    ).thenReturn(logError);

    service = TestBed.inject(ConsumeRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a consumable', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenThrow(new Error(errorMessages['WRONG-ITEM']));

        expect(() =>
          service.execute(
            instance(mockedPlayerEntity),
            actionableEvent(actionConsume, simpleSword.identity.name)
          )
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });

    describe('when consumable has skill requirement', () => {
      describe('when skill check fails', () => {
        it('should not recover HP | Energy', () => {
          when(
            mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
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

          expect(result).toEqual({});
        });
      });

      describe('when skill check passes', () => {
        it('should recover HP | Energy', () => {
          when(
            mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
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
                effect: new EffectEvent('REMEDY', 5),
                energy: 0,
              })
            )
          ).thenReturn(logHeal5);

          const result = service.execute(
            instance(mockedPlayerEntity),
            eventConsumeFirstAid
          );

          expect(result).toEqual({});
        });
      });

      describe('when actor skill value was 0', () => {
        it('should log error message', () => {
          when(
            mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
              instance(mockedInventoryService),
              playerInfo.id,
              consumableFirstAid.identity.name
            )
          ).thenReturn(consumableFirstAid);

          when(mockedPlayerEntity.skills).thenReturn({ 'First Aid': 0 });

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

          expect(result).toEqual({});
        });
      });
    });

    describe('when consumable has no skill requirement', () => {
      it('should recover HP | Energy', () => {
        when(
          mockedExtractorHelper.extractItemOrThrow<ConsumableDefinition>(
            instance(mockedInventoryService),
            playerInfo.id,
            consumableAnalgesic.identity.name
          )
        ).thenReturn(consumableAnalgesic);

        when(
          mockedPlayerEntity.reactTo(
            deepEqual(actionConsume),
            'NONE',
            deepEqual({
              effect: new EffectEvent('REMEDY', 2),
              energy: 1,
            })
          )
        ).thenReturn(logHeal2);

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventConsumeAnalgesic
        );

        expect(result).toEqual({});
      });
    });
  });
});

const logAnalgesic1 = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  consumableAnalgesic.identity.label
);

const logHeal2 = `${consumableAnalgesic.effect}-2`;

const logAnalgesic2 = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  logHeal2
);

const logFirstAid1 = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  'First Aid Kit'
);

const logFirstAidSuccess = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  'First Aid-10-SUCCESS'
);

const logHeal5 = `${consumableFirstAid.effect}-5`;

const logFirstAid3 = new LogMessageDefinition(
  'CONSUMED',
  playerInfo.name,
  logHeal5
);

const logFirstAidFailure = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  'First Aid-100-FAILURE'
);

const logError = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  'First Aid'
);

const eventConsumeFirstAid = actionableEvent(
  actionConsume,
  consumableFirstAid.identity.name
);

const eventConsumeAnalgesic = actionableEvent(
  actionConsume,
  consumableAnalgesic.identity.name
);

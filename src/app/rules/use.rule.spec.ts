import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UseRule } from './use.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { GameMessagesStoreService } from '../stores/game-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import {
  playerInfo,
  interactiveInfo,
  actionUseMasterKey,
  masterKey,
  actionableEvent,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('UseRule', () => {
  let service: UseRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: GameMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(UseRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item could not be found', () => {
      it('should log item not found', () => {
        when(
          mockedStringMessagesStoreService.createNotFoundLogMessage(
            playerInfo.name,
            masterKey.identity.label
          )
        ).thenReturn(notFoundLog);

        ruleScenario(service, actor, eventUseMasterKey, extras, [notFoundLog]);
      });
    });

    describe('when item could be found', () => {
      it('should log item lost', () => {
        when(
          mockedStringMessagesStoreService.createLostLogMessage(
            playerInfo.name,
            masterKey.identity.label
          )
        ).thenReturn(itemLostLog);

        when(
          mockedInventoryService.take(playerInfo.id, masterKey.identity.name)
        ).thenReturn(masterKey);

        ruleScenario(service, actor, eventUseMasterKey, extras, [itemLostLog]);
      });

      describe('when state returns log', () => {
        it('should log item lost', () => {
          when(
            mockedStringMessagesStoreService.createLostLogMessage(
              playerInfo.name,
              masterKey.identity.label
            )
          ).thenReturn(itemLostLog);

          when(
            mockedInventoryService.take(playerInfo.id, masterKey.identity.name)
          ).thenReturn(masterKey);

          when(
            mockedStringMessagesStoreService.createFreeLogMessage(
              'USED',
              interactiveInfo.name,
              openedUsingLog
            )
          ).thenReturn(usedLog);

          when(
            mockedInteractiveEntity.reactTo(
              actionUseMasterKey,
              'USED',
              deepEqual({
                item: masterKey,
              })
            )
          ).thenReturn(openedUsingLog);

          ruleScenario(service, actor, eventUseMasterKey, extras, [
            usedLog,
            itemLostLog,
          ]);
        });
      });
    });
  });
});

const notFoundLog = new LogMessageDefinition(
  'NOT-FOUND',
  playerInfo.name,
  masterKey.identity.label
);

const openedUsingLog = `opened using ${masterKey.identity.name}`;

const usedLog = new LogMessageDefinition(
  'USED',
  interactiveInfo.name,
  openedUsingLog
);

const itemLostLog = new LogMessageDefinition(
  'LOST',
  playerInfo.name,
  masterKey.identity.name
);

const eventUseMasterKey = actionableEvent(
  actionUseMasterKey,
  interactiveInfo.id
);

const actor = instance(mockedPlayerEntity);

const extras = {
  target: instance(mockedInteractiveEntity),
};

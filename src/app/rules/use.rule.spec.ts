import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UseRule } from './use.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';

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
  simpleSword,
  actionableEvent,
} from '../../../tests/fakes';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

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
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createNotFoundLogMessage(
        playerInfo.name,
        masterKey.identity.label
      )
    ).thenReturn(notFoundLog);

    when(
      mockedStringMessagesStoreService.createOpenedUsingMessage(
        masterKey.identity.label
      )
    ).thenReturn(openedUsingLog);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'USED',
        interactiveInfo.name,
        openedUsingLog
      )
    ).thenReturn(usedLog);

    when(
      mockedStringMessagesStoreService.createLostLogMessage(
        playerInfo.name,
        masterKey.identity.label
      )
    ).thenReturn(itemLostLog);

    service = TestBed.inject(UseRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item was not found', () => {
    it('return item label not found', () => {
      when(
        mockedInventoryService.take(playerInfo.id, simpleSword.identity.name)
      ).thenReturn(null);

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventUseMasterKey,
        { target: instance(mockedInteractiveEntity) }
      );

      expect(result).toEqual({ logs: [notFoundLog] });
    });
  });

  describe('when item was usable', () => {
    it('return log', () => {
      when(
        mockedInventoryService.take(playerInfo.id, masterKey.identity.name)
      ).thenReturn(masterKey);

      when(
        mockedInteractiveEntity.reactTo(
          actionUseMasterKey,
          'USED',
          deepEqual({
            item: masterKey,
          })
        )
      ).thenReturn(openedUsingLog);

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventUseMasterKey,
        { target: instance(mockedInteractiveEntity) }
      );

      expect(result).toEqual({ logs: [usedLog, itemLostLog] });
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

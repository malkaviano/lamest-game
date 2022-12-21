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

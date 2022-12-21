import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, verify, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionPickSimpleSword,
  interactiveInfo,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { LogMessageDefinition } from '../definitions/log-message.definition';

describe('PickRule', () => {
  let service: PickRule;

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
      mockedStringMessagesStoreService.createTookLogMessage(
        playerInfo.name,
        interactiveInfo.name,
        simpleSword.identity.label
      )
    ).thenReturn(log);

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const log = new LogMessageDefinition(
  'TOOK',
  playerInfo.name,
  `${interactiveInfo.name}-${simpleSword.identity.label}`
);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);

import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UseRule } from './use.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import {
  createFreeLogMessage,
  createLostLogMessage,
  createNotFoundLogMessage,
  createOpenedUsingMessage,
} from '../definitions/log-message.definition';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
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
      ],
    });

    setupMocks();

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
      ).thenReturn(createOpenedUsingMessage(masterKey.identity.label));

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventUseMasterKey,
        { target: instance(mockedInteractiveEntity) }
      );

      expect(result).toEqual({ logs: [openedLog, itemLostLog] });
    });
  });
});

const notFoundLog = createNotFoundLogMessage(
  playerInfo.name,
  masterKey.identity.label
);

const openedLog = createFreeLogMessage(
  interactiveInfo.name,
  createOpenedUsingMessage(masterKey.identity.label)
);

const itemLostLog = createLostLogMessage(
  playerInfo.name,
  masterKey.identity.label
);

const eventUseMasterKey = actionableEvent(
  actionUseMasterKey,
  interactiveInfo.id
);

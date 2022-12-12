import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UseRule } from './use.rule';
import { errorMessages } from '../definitions/error-messages.definition';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';

import { ArrayView } from '../views/array.view';
import {
  createFreeLogMessage,
  createLostLogMessage,
  createNotFoundLogMessage,
  createOpenedUsingMessage,
} from '../definitions/log-message.definition';

import {
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
} from '../../../tests/mocks';
import {
  playerInfo,
  interactiveInfo,
  actionUseMasterKey,
  eventUseMasterKey,
  eventWrongUseSimpleSword,
  masterKey,
  simpleSword,
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
      ],
    });

    service = TestBed.inject(UseRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when item category was not USABLE', () => {
    it('throw Wrong item was used', () => {
      when(mockedInventoryService.check(playerInfo.id)).thenReturn(
        new ArrayView([new ItemStorageDefinition(simpleSword, 1)])
      );

      expect(() =>
        service.execute(
          instance(mockedPlayerEntity),
          eventWrongUseSimpleSword,
          instance(mockedInteractiveEntity)
        )
      ).toThrowError(errorMessages['WRONG-ITEM']);
    });
  });

  describe('when item was not found', () => {
    it('return item label not found', () => {
      when(mockedInventoryService.check(playerInfo.id)).thenReturn(
        new ArrayView([new ItemStorageDefinition(simpleSword, 1)])
      );

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventUseMasterKey,
        instance(mockedInteractiveEntity)
      );

      expect(result).toEqual({ logs: [notFoundLog] });
    });
  });

  describe('when item was usable', () => {
    it('return log', () => {
      when(mockedInventoryService.check(playerInfo.id)).thenReturn(
        new ArrayView([new ItemStorageDefinition(masterKey, 1)])
      );

      when(
        mockedInventoryService.take(playerInfo.id, masterKey.name)
      ).thenReturn(masterKey);

      when(
        mockedInteractiveEntity.reactTo(
          actionUseMasterKey,
          'USED',
          deepEqual({
            item: masterKey,
          })
        )
      ).thenReturn(createOpenedUsingMessage(masterKey.label));

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventUseMasterKey,
        instance(mockedInteractiveEntity)
      );

      expect(result).toEqual({ logs: [openedLog, itemLostLog] });
    });
  });
});

const notFoundLog = createNotFoundLogMessage(playerInfo.name, masterKey.label);

const openedLog = createFreeLogMessage(
  interactiveInfo.name,
  createOpenedUsingMessage(masterKey.label)
);

const itemLostLog = createLostLogMessage(playerInfo.name, masterKey.label);

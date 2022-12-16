import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { InspectRule } from './inspect.rule';
import { errorMessages } from '../definitions/error-messages.definition';
import { ArrayView } from '../views/array.view';
import { ItemStoredDefinition } from '../definitions/item-storage.definition';

import {
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  eventInspect,
  playerInfo,
  readable,
  simpleSword,
} from '../../../tests/fakes';
import { createItemInspectedLogs } from '../definitions/log-message.definition';

describe('InspectRule', () => {
  let service: InspectRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(InspectRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not in inventory', () => {
      it('throw Invalid operation ocurred', () => {
        when(mockedInventoryService.check(playerInfo.id)).thenReturn(
          ArrayView.create([])
        );

        expect(() =>
          service.execute(
            instance(mockedPlayerEntity),
            eventInspect(readable.identity.name)
          )
        ).toThrowError(errorMessages['INVALID-OPERATION']);
      });
    });

    describe('when item was not READABLE', () => {
      it('throw Wrong item was used', () => {
        when(mockedInventoryService.check(playerInfo.id)).thenReturn(
          ArrayView.create([new ItemStoredDefinition(simpleSword, 1)])
        );

        expect(() =>
          service.execute(
            instance(mockedPlayerEntity),
            eventInspect(simpleSword.identity.name)
          )
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was READABLE', () => {
      it('return log and documentOpened', () => {
        when(mockedInventoryService.check(playerInfo.id)).thenReturn(
          ArrayView.create([new ItemStoredDefinition(readable, 1)])
        );

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventInspect(readable.identity.name)
        );

        expect(result).toEqual({
          logs: [log],
          documentOpened: {
            title: readable.title,
            text: readable.text,
          },
        });
      });
    });
  });
});

const log = createItemInspectedLogs(playerInfo.name, readable.identity.label);

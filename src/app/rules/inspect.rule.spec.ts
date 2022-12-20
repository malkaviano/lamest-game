import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { InspectRule } from './inspect.rule';
import { errorMessages } from '../definitions/error-messages.definition';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

import {
  mockedInventoryService,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionInspect,
  playerInfo,
  readable,
  simpleSword,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

describe('InspectRule', () => {
  let service: InspectRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createItemInspectedLogMessage(
        playerInfo.name,
        readable.identity.label
      )
    ).thenReturn(log);

    service = TestBed.inject(InspectRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was null', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedInventoryService.look(playerInfo.id, eventInspectWrong.eventId)
        ).thenReturn(null);

        expect(() =>
          service.execute(instance(mockedPlayerEntity), eventInspectWrong)
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was READABLE', () => {
      it('return log and documentOpened', () => {
        when(
          mockedInventoryService.look(playerInfo.id, readable.identity.name)
        ).thenReturn(readable);

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventInspectReadable
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

const eventInspectReadable = actionableEvent(
  actionInspect,
  readable.identity.name
);

const eventInspectWrong = actionableEvent(
  actionInspect,
  simpleSword.identity.name
);

const log = new LogMessageDefinition(
  'INSPECTED',
  playerInfo.name,
  readable.identity.label
);

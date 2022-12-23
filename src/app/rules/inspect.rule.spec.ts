import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';
import { take } from 'rxjs';

import { InventoryService } from '../services/inventory.service';
import { InspectRule } from './inspect.rule';
import { GameMessagesStoreService } from '../stores/game-messages.store';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ReadableInterface } from '../interfaces/readable.interface';

import {
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionInspect,
  playerInfo,
  readable,
  simpleSword,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

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
    describe('when item could not be found', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedInventoryService.look(playerInfo.id, eventInspectWrong.eventId)
        ).thenReturn(null);

        expect(() =>
          service.execute(instance(mockedPlayerEntity), eventInspectWrong)
        ).toThrowError(GameMessagesStoreService.errorMessages['WRONG-ITEM']);
      });
    });

    describe('item was found', () => {
      it('should log item was inspected', () => {
        when(
          mockedInventoryService.look(
            playerInfo.id,
            eventInspectReadable.eventId
          )
        ).thenReturn(readable);

        ruleScenario(service, actor, eventInspectReadable, {}, [
          itemInspectedLog,
        ]);
      });

      it('should publish document opened', () => {
        when(
          mockedInventoryService.look(
            playerInfo.id,
            eventInspectReadable.eventId
          )
        ).thenReturn(readable);

        let result: ReadableInterface | undefined;

        service.documentOpened$.pipe(take(100)).subscribe((event) => {
          result = event;
        });

        service.execute(actor, eventInspectReadable);

        expect(result).toEqual(result);
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const eventInspectReadable = actionableEvent(
  actionInspect,
  readable.identity.name
);

const eventInspectWrong = actionableEvent(
  actionInspect,
  simpleSword.identity.name
);

const itemInspectedLog = new LogMessageDefinition(
  'INSPECTED',
  playerInfo.name,
  'inspected Book'
);

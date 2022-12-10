import { TestBed } from '@angular/core/testing';

import { of, Subject, take } from 'rxjs';
import { anyString, anything, instance, when } from 'ts-mockito';

import { ActionableItemDefinition } from '../definitions/actionable-item.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';
import { GameBridgeService } from './game-bridge.service';
import { InventoryService } from './inventory.service';
import { GameLoopService } from './game-loop.service';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { CharacterService } from './character.service';
import { NarrativeService } from './narrative.service';
import { LoggingService } from './logging.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedCharacterService,
  mockedGameLoopService,
  mockedInventoryService,
  mockedLoggingService,
  mockedNarrativeService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionEquip,
  actionConsume,
  bubbleGum,
  unDodgeableAxe,
} from '../../../tests/fakes';

describe('GameBridgeService', () => {
  let service: GameBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: GameLoopService,
          useValue: instance(mockedGameLoopService),
        },
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
        {
          provide: LoggingService,
          useValue: instance(mockedLoggingService),
        },
      ],
    });

    setupMocks();

    when(mockedInventoryService.inventoryChanged$).thenReturn(
      inventoryEventSubject
    );

    when(mockedLoggingService.gameLog$).thenReturn(of(log));

    service = TestBed.inject(GameBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when player inventory changes', () => {
    [
      {
        invEvent: new InventoryEvent('CONSUME', 'player', bubbleGum),
        expected: new ActionableItemDefinition(bubbleGum, actionConsume),
        item: bubbleGum,
      },
      {
        invEvent: new InventoryEvent('EQUIP', 'player', unDodgeableAxe),
        expected: new ActionableItemDefinition(unDodgeableAxe, actionEquip),
        item: unDodgeableAxe,
      },
    ].forEach(({ invEvent, expected, item }) => {
      it(`should emit event ${invEvent.eventName}`, (done) => {
        let result: ArrayView<ActionableItemDefinition> | undefined;

        when(mockedInventoryService.check(anyString())).thenReturn(
          new ArrayView([new ItemStorageDefinition(item, 1)])
        );

        service.events.playerInventory$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        inventoryEventSubject.next(invEvent);

        done();

        expect(result).toEqual(new ArrayView([expected]));
      });
    });
  });

  describe('actionableReceived', () => {
    it('should invoke GameLoopService run', (done) => {
      let result = false;

      when(mockedGameLoopService.run(anything())).thenCall(
        () => (result = true)
      );

      service.actionableReceived(actionableEvent);

      done();

      expect(result).toEqual(true);
    });
  });
});

const actionableEvent = new ActionableEvent(actionEquip, unDodgeableAxe.name);

const inventoryEventSubject = new Subject<InventoryEvent>();

const log = new LogMessageDefinition('FREE', 'player', unDodgeableAxe.label);

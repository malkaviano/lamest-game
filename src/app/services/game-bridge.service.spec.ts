import { TestBed } from '@angular/core/testing';

import { of, Subject, take } from 'rxjs';
import { anyString, instance, when } from 'ts-mockito';

import { ActionableItemView } from '../views/actionable-item.view';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';
import { GameBridgeService } from './game-bridge.service';
import { InventoryService } from './inventory.service';
import { GameLoopService } from './game-loop.service';
import { ItemStoredDefinition } from '../definitions/item-storage.definition';
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
  consumableFirstAid,
  unDodgeableAxe,
  eventEquipUnDodgeableAxe,
  masterKey,
  actionNoop,
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
        invEvent: new InventoryEvent('CONSUME', 'player', consumableFirstAid),
        expected: ActionableItemView.create(consumableFirstAid, actionConsume),
        item: consumableFirstAid,
      },
      {
        invEvent: new InventoryEvent('EQUIP', 'player', unDodgeableAxe),
        expected: ActionableItemView.create(unDodgeableAxe, actionEquip),
        item: unDodgeableAxe,
      },
      {
        invEvent: new InventoryEvent('STORE', 'player', masterKey),
        expected: ActionableItemView.create(masterKey, actionNoop),
        item: masterKey,
      },
    ].forEach(({ invEvent, expected, item }) => {
      it(`should emit event ${invEvent.eventName}`, (done) => {
        let result: ArrayView<ActionableItemView> | undefined;

        when(mockedInventoryService.check(anyString())).thenReturn(
          ArrayView.create([new ItemStoredDefinition(item, 1)])
        );

        service.events.playerInventory$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        inventoryEventSubject.next(invEvent);

        done();

        expect(result).toEqual(ArrayView.create([expected]));
      });
    });
  });

  describe('actionableReceived', () => {
    it('should invoke GameLoopService run', (done) => {
      let result = false;

      when(mockedGameLoopService.run()).thenCall(() => (result = true));

      service.actionableReceived(eventEquipUnDodgeableAxe);

      done();

      expect(result).toEqual(true);
    });
  });
});

const inventoryEventSubject = new Subject<InventoryEvent>();

const log = new LogMessageDefinition(
  'FREE',
  'player',
  unDodgeableAxe.identity.label
);

import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';
import { anyString, instance, when } from 'ts-mockito';

import { ActionableItemView } from '../views/actionable-item.view';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';
import { GameBridgeService } from './game-bridge.service';
import { InventoryService } from './inventory.service';
import { GameRoundService } from './game-round.service';
import { ItemStoredDefinition } from '../definitions/item-storage.definition';
import { CharacterService } from './character.service';
import { NarrativeService } from './narrative.service';

import {
  mockedCharacterService,
  mockedEventHubHelperService,
  mockedGameRoundService,
  mockedInventoryService,
  mockedNarrativeService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionEquip,
  actionConsume,
  consumableFirstAid,
  unDodgeableAxe,
  masterKey,
  actionNoop,
  playerInfo,
  actionableEvent,
  readable,
  actionInspect,
} from '../../../tests/fakes';
import { EventHubHelperService } from '../helpers/event-hub.helper.service';

describe('GameBridgeService', () => {
  let service: GameBridgeService;

  let running = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: GameRoundService,
          useValue: instance(mockedGameRoundService),
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
          provide: EventHubHelperService,
          useValue: instance(mockedEventHubHelperService),
        },
      ],
    });

    setupMocks();

    when(mockedInventoryService.inventoryChanged$).thenReturn(
      inventoryEventSubject
    );

    when(mockedGameRoundService.run()).thenCall(() => (running = true));

    service = TestBed.inject(GameBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should invoke game round service', () => {
    expect(running).toEqual(true);
  });

  describe('when player inventory changes', () => {
    [
      {
        invEvent: new InventoryEvent(
          'STORE',
          playerInfo.id,
          consumableFirstAid
        ),
        expected: ActionableItemView.create(consumableFirstAid, actionConsume),
        item: consumableFirstAid,
      },
      {
        invEvent: new InventoryEvent('STORE', playerInfo.id, unDodgeableAxe),
        expected: ActionableItemView.create(unDodgeableAxe, actionEquip),
        item: unDodgeableAxe,
      },
      {
        invEvent: new InventoryEvent('STORE', playerInfo.id, masterKey),
        expected: ActionableItemView.create(masterKey, actionNoop),
        item: masterKey,
      },
      {
        invEvent: new InventoryEvent('STORE', playerInfo.id, readable),
        expected: ActionableItemView.create(readable, actionInspect),
        item: readable,
      },
    ].forEach(({ invEvent, expected, item }) => {
      it(`should emit event ${invEvent.eventName}`, (done) => {
        let result: ArrayView<ActionableItemView> | undefined;

        when(mockedInventoryService.list(anyString())).thenReturn(
          ArrayView.create([new ItemStoredDefinition(item, 1)])
        );

        service.events.playerInventory$.subscribe((event) => {
          result = event;
        });

        inventoryEventSubject.next(invEvent);

        done();

        expect(result).toEqual(ArrayView.create([expected]));
      });
    });
  });

  describe('actionableReceived', () => {
    it('should invoke player action', (done) => {
      let result = false;

      when(
        mockedPlayerEntity.playerDecision(eventEquipUnDodgeableAxe)
      ).thenCall(() => (result = true));

      service.actionableReceived(eventEquipUnDodgeableAxe);

      done();

      expect(result).toEqual(true);
    });
  });
});

const inventoryEventSubject = new Subject<InventoryEvent>();

const eventEquipUnDodgeableAxe = actionableEvent(
  actionEquip,
  unDodgeableAxe.identity.name
);

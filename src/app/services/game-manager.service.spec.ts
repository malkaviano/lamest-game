import { TestBed } from '@angular/core/testing';

import { of, Subject, take } from 'rxjs';
import { anyString, anything, instance, mock, reset, when } from 'ts-mockito';

import { ActionableItemDefinition } from '../definitions/actionable-item.definition';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';
import { GameManagerService } from './game-manager.service';
import { InventoryService } from './inventory.service';
import { GameLoopService } from './game-loop.service';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { ConsumableDefinition } from '../definitions/consumable.definition';
import { createDice } from '../definitions/dice.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { CharacterService } from './character.service';
import { NarrativeService } from './narrative.service';
import { LoggingService } from './logging.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

const sword = new WeaponDefinition(
  'sword',
  'Sword',
  'That is a sword',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

const bubbleGum = new ConsumableDefinition(
  'bubbleGum',
  'Bubble Gum',
  'That is a bubble gum',
  1
);

const actionEquip = createActionableDefinition('EQUIP', 'equip', 'Equip');

const actionUse = createActionableDefinition('CONSUME', 'consume', 'Consume');

describe('GameManagerService', () => {
  let service: GameManagerService;

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

    reset(mockedInventoryService);

    when(mockedInventoryService.inventoryChanged$).thenReturn(
      inventoryEventSubject
    );

    when(mockedLoggingService.gameLog$).thenReturn(of(log));

    service = TestBed.inject(GameManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when player inventory changes', () => {
    [
      {
        invEvent: new InventoryEvent('CONSUME', 'player', bubbleGum),
        expected: new ActionableItemDefinition(bubbleGum, actionUse),
        item: bubbleGum,
      },
      {
        invEvent: new InventoryEvent('EQUIP', 'player', sword),
        expected: new ActionableItemDefinition(sword, actionEquip),
        item: sword,
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
      let result: LogMessageDefinition | undefined;

      when(mockedGameLoopService.run(anything())).thenReturn({ logs: [log] });

      service.events.actionLogged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      service.actionableReceived(actionableEvent);

      done();

      expect(result).toEqual(log);
    });
  });
});

const mockedInventoryService = mock(InventoryService);

const mockedGameLoopService = mock(GameLoopService);

const actionableEvent = new ActionableEvent(actionEquip, 'gg');

const inventoryEventSubject = new Subject<InventoryEvent>();

const mockedCharacterService = mock(CharacterService);

const mockedNarrativeService = mock(NarrativeService);

const mockedLoggingService = mock(LoggingService);

const log = new LogMessageDefinition('FREE', 'me', 'GG');

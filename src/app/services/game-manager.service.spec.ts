import { TestBed } from '@angular/core/testing';

import { Subject, take } from 'rxjs';
import { anyString, anything, instance, mock, reset, when } from 'ts-mockito';

import { ActionableItemDefinition } from '../definitions/actionable-item.definition';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
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

const sword = new WeaponDefinition(
  'sword',
  'Sword',
  'That is a sword',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0)
);

const bubbleGum = new ConsumableDefinition(
  'bubbleGum',
  'Bubble Gum',
  'That is a bubble gum'
);

const actionEquip = createActionableDefinition('EQUIP', 'equip', 'Equip');

const actionUse = createActionableDefinition('USE', 'use', 'Use');

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
      ],
    });

    reset(mockedInventoryService);

    when(mockedInventoryService.inventoryChanged$).thenReturn(
      subject.asObservable()
    );

    service = TestBed.inject(GameManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when player inventory changes', () => {
    [
      {
        invEvent: new InventoryEvent('USE', 'player', bubbleGum),
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
        let result:
          | {
              items: ArrayView<ActionableItemDefinition>;
              equipped: GameItemDefinition | null;
            }
          | undefined;

        when(mockedInventoryService.check(anyString())).thenReturn(
          new ArrayView([new ItemStorageDefinition(item, 1)])
        );

        service.events.playerInventory$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        subject.next(invEvent);

        done();

        expect(result).toEqual({
          items: new ArrayView([expected]),
          equipped: null,
        });
      });
    });
  });

  describe('actionableReceived', () => {
    it('should invoke GameLoopService run', () => {
      let result: ActionableEvent | undefined;

      when(mockedGameLoopService.run(anything())).thenCall(() => {
        result = actionableEvent;
      });

      service.actionableReceived(actionableEvent);

      expect(result).toEqual(actionableEvent);
    });
  });
});

const mockedInventoryService = mock(InventoryService);

const mockedGameLoopService = mock(GameLoopService);

const actionableEvent = new ActionableEvent(actionEquip, 'gg');

const subject = new Subject<InventoryEvent>();

import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { anyString, anything, instance, when } from 'ts-mockito';
import { EMPTY, of, Subject } from 'rxjs';

import { CharacterService } from './character.service';
import { GameRoundService } from './game-round.service';
import { NarrativeService } from './narrative.service';
import { ReadableInterface } from '../interfaces/readable.interface';
import { ArrayView } from '../views/array.view';
import { RuleDispatcherService } from './rule-dispatcher.service';
import { EventHubHelperService } from '../helpers/event-hub.helper.service';
import { InventoryEvent } from '../events/inventory.event';

import {
  actionableEvent,
  actionAttack,
  interactiveInfo,
  playerInfo,
  unDodgeableAxe,
  actionEquip,
  actionConsume,
  consumableFirstAid,
  masterKey,
  actionNoop,
  readable,
  actionInspect,
} from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedActorEntity2,
  mockedCharacterService,
  mockedCombatRule,
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedRuleDispatcherService,
  mockedSceneEntity,
  setupMocks,
  mockedInteractiveEntity,
  mockedEventHubHelperService,
  mockedInventoryService,
} from '../../../tests/mocks';
import { ActionableItemView } from '../views/actionable-item.view';
import { ItemStoredDefinition } from '../definitions/item-storage.definition';
import { InventoryService } from './inventory.service';

const actor = instance(mockedActorEntity);

const actor2 = instance(mockedActorEntity2);

describe('GameRoundService', () => {
  let service: GameRoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RuleDispatcherService,
          useValue: instance(mockedRuleDispatcherService),
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
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
      ],
    });

    setupMocks();

    when(mockedActorEntity.action(anything())).thenReturn(eventAttackPlayer);

    when(mockedActorEntity2.action(anything())).thenReturn(eventAttackPlayer);

    when(mockedPlayerEntity.action).thenReturn(() => eventAttackInteractive);

    when(mockedRuleDispatcherService.dispatcher).thenReturn({
      AFFECT: instance(mockedCombatRule),
    });

    when(mockedEventHubHelperService.logMessageProduced$).thenReturn(EMPTY);

    when(mockedEventHubHelperService.actorDodged$).thenReturn(
      of(playerInfo.id)
    );

    when(mockedEventHubHelperService.documentOpened$).thenReturn(
      documentSubject
    );

    when(mockedSceneEntity.interactives).thenReturn(
      ArrayView.create([instance(mockedInteractiveEntity), actor, actor2])
    );

    when(mockedNarrativeService.sceneChanged$).thenReturn(
      of(instance(mockedSceneEntity))
    );

    when(mockedInventoryService.inventoryChanged$).thenReturn(
      inventoryEventSubject
    );

    service = TestBed.inject(GameRoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('start', () => {
    it('should invoke run', fakeAsync(() => {
      when(mockedActorEntity.action(ArrayView.create([]))).thenReturn(null);

      when(mockedActorEntity2.action(ArrayView.create([]))).thenReturn(null);

      service.start();

      tick(1000);

      service.stop();
    }));
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
    it('should invoke player action', () => {
      let result = false;

      when(
        mockedPlayerEntity.playerDecision(eventEquipUnDodgeableAxe)
      ).thenCall(() => (result = true));

      service.actionableReceived(eventEquipUnDodgeableAxe);

      expect(result).toEqual(true);
    });
  });
});

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

const documentSubject = new Subject<ReadableInterface>();

const inventoryEventSubject = new Subject<InventoryEvent>();

const eventEquipUnDodgeableAxe = actionableEvent(
  actionEquip,
  unDodgeableAxe.identity.name
);

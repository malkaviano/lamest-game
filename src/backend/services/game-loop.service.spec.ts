import { fakeAsync, tick } from '@angular/core/testing';

import { anyString, anything, instance, when } from 'ts-mockito';
import { EMPTY, of, Subject } from 'rxjs';

import { GameLoopService } from './game-loop.service';
import { ReadableInterface } from '../../core/interfaces/readable.interface';
import { ItemStoredDefinition } from '../../core/definitions/item-storage.definition';
import { ArrayView } from '../../core/view-models/array.view';
import { ActionableItemView } from '../../core/view-models/actionable-item.view';
import { InventoryEvent } from '../../core/events/inventory.event';

import {
  actionableEvent,
  actionAffect,
  interactiveInfo,
  playerInfo,
  unDodgeableAxe,
  actionEquip,
  actionConsume,
  consumableFirstAid,
  masterKey,
  actionNoop,
  readable,
  actionRead,
} from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedActorEntity2,
  mockedCharacterService,
  mockedAffectRule,
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedRulesHub,
  mockedSceneEntity,
  setupMocks,
  mockedInteractiveEntity,
  mockedEventHub,
  mockedInventoryService,
  mockedPolicyHub,
  mockedLoggingHub,
} from '../../../tests/mocks';

const actor = instance(mockedActorEntity);

const actor2 = instance(mockedActorEntity2);

describe('GameLoopService', () => {
  let service: GameLoopService;

  beforeEach(() => {
    setupMocks();

    when(mockedLoggingHub.logMessageProduced$).thenReturn(EMPTY);

    when(mockedEventHub.actorDodged$).thenReturn(of(playerInfo.id));

    when(mockedEventHub.documentOpened$).thenReturn(documentSubject);

    when(mockedSceneEntity.interactives).thenReturn(
      ArrayView.create(instance(mockedInteractiveEntity), actor, actor2)
    );

    when(mockedNarrativeService.sceneChanged$).thenReturn(
      of(instance(mockedSceneEntity))
    );

    when(mockedInventoryService.inventoryChanged$).thenReturn(
      inventoryEventSubject
    );

    when(
      mockedAffectRule.execute(anything(), anything(), anything())
    ).thenReturn({
      name: 'AFFECT',
      actor,
      event: eventAttackInteractive,
      result: 'EXECUTED',
    });

    service = new GameLoopService(
      instance(mockedRulesHub),
      instance(mockedCharacterService),
      instance(mockedNarrativeService),
      instance(mockedPolicyHub),
      instance(mockedEventHub),
      instance(mockedInventoryService),
      instance(mockedLoggingHub)
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('start', () => {
    it('should invoke run', fakeAsync(() => {
      when(mockedActorEntity.action(anything())).thenReturn(eventAttackPlayer);

      when(mockedActorEntity2.action(anything())).thenReturn(eventAttackPlayer);

      when(mockedPlayerEntity.action()).thenReturn(eventAttackInteractive);

      let result = false;

      when(mockedRulesHub.dispatcher).thenCall(() => {
        result = true;

        return { AFFECT: instance(mockedAffectRule) };
      });

      service.start();

      tick(100);

      service.stop();

      expect(result).toEqual(true);
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
        expected: ActionableItemView.create(readable, actionRead),
        item: readable,
      },
    ].forEach(({ invEvent, expected, item }) => {
      it(`should emit event ${invEvent.eventName}`, (done) => {
        let result: ArrayView<ActionableItemView> | undefined;

        when(mockedInventoryService.list(anyString())).thenReturn(
          ArrayView.create(new ItemStoredDefinition(item, 1))
        );

        service.events.playerInventory$.subscribe((event) => {
          result = event;
        });

        inventoryEventSubject.next(invEvent);

        done();

        expect(result).toEqual(ArrayView.create(expected));
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

const eventAttackPlayer = actionableEvent(actionAffect, playerInfo.id);

const eventAttackInteractive = actionableEvent(
  actionAffect,
  interactiveInfo.id
);

const documentSubject = new Subject<ReadableInterface>();

const inventoryEventSubject = new Subject<InventoryEvent>();

const eventEquipUnDodgeableAxe = actionableEvent(
  actionEquip,
  unDodgeableAxe.identity.name
);

import { anyString, anything, instance, verify, when } from 'ts-mockito';
import { EMPTY, of, Subject } from 'rxjs';

import { GameLoopService } from './game-loop.service';
import { ReadableInterface } from '@core/interfaces/readable.interface';
import { ItemStoredDefinition } from '@core/definitions/item-storage.definition';
import { ArrayView } from '@core/view-models/array.view';
import { ActionableItemView } from '@core/view-models/actionable-item.view';
import { InventoryEvent } from '@core/events/inventory.event';

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
  mockedInventoryService,
  mockedPolicyHub,
  mockedLoggingHub,
  mockedGamePredicate,
} from '../../../tests/mocks';
import { SettingsStore } from '../../stores/settings.store';

const actor = instance(mockedActorEntity);

const actor2 = instance(mockedActorEntity2);

describe('GameLoopService', () => {
  let service: GameLoopService;

  beforeEach(() => {
    setupMocks();

    when(mockedLoggingHub.logMessageProduced$).thenReturn(EMPTY);

    when(mockedRulesHub.actorDodged$).thenReturn(of(playerInfo.id));

    when(mockedRulesHub.documentOpened$).thenReturn(documentSubject);

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

    when(
      mockedGamePredicate.hasEnoughActionPoints(anything(), anything())
    ).thenReturn(true);

    service = new GameLoopService(
      instance(mockedRulesHub),
      instance(mockedCharacterService),
      instance(mockedNarrativeService),
      instance(mockedPolicyHub),
      instance(mockedGamePredicate),
      instance(mockedInventoryService),
      instance(mockedLoggingHub)
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('start', () => {
    it('invoke run', async () => {
      const { result } = await testRun(service);

      verify(
        mockedAffectRule.execute(anything(), anything(), anything())
      ).twice();

      verify(mockedPolicyHub.enforcePolicies(anything())).twice();

      expect(result).toEqual(true);
    });

    it('invoke actors execute action', async () => {
      const { actor1Played, actor2Played } = await testRun(service);

      expect({ actor1Played, actor2Played }).toEqual({
        actor1Played: true,
        actor2Played: true,
      });
    });
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

async function testRun(
  service: GameLoopService
): Promise<{ result: boolean; actor1Played: boolean; actor2Played: boolean }> {
  let result = false;

  let actor1Played = false;

  let actor2Played = false;

  when(mockedRulesHub.dispatcher).thenCall(() => {
    result = true;

    return { AFFECT: instance(mockedAffectRule) };
  });

  when(mockedAffectRule.name).thenReturn('AFFECT');

  when(mockedActorEntity.action(anything())).thenReturn(eventAttackPlayer);

  when(mockedActorEntity2.action(anything())).thenReturn(eventAttackPlayer);

  when(mockedAffectRule.execute(actor, anything(), anything())).thenCall(
    () => (actor1Played = true)
  );

  when(mockedAffectRule.execute(actor2, anything(), anything())).thenCall(
    () => (actor2Played = true)
  );

  service.start();

  // Portable event tick
  await new Promise((resolve) =>
    setTimeout(resolve, SettingsStore.settings.aiLoopMilliseconds)
  );

  service.stop();

  return { result, actor1Played, actor2Played };
}

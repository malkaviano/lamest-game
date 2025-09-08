import { EMPTY, Subject, of } from 'rxjs';
import { anyString, anything, instance, when } from 'ts-mockito';

import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { ItemStoredDefinition } from '@definitions/item-storage.definition';
import { InventoryEvent } from '@events/inventory.event';
import { ReadableDefinition } from '@definitions/readable.definition';
import { GameLoopService } from '@services/game-loop.service';
import { ArrayView } from '@wrappers/array.view';
import {
  affectActionable,
  consumeActionable,
  createActionableDefinition,
  equipActionable,
  readActionable,
} from '@definitions/actionable.definition';

import {
  actionableEvent,
  consumableFirstAid,
  interactiveInfo,
  discardKey,
  playerInfo,
  readable,
  unDodgeableAxe,
} from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedActorEntity2,
  mockedAffectRule,
  mockedCharacterService,
  mockedGamePredicate,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedLoggingHub,
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedPolicyHub,
  mockedRulesHub,
  mockedSceneEntity,
  setupMocks,
} from '../../../tests/mocks';

const actor = instance(mockedActorEntity);

const actor2 = instance(mockedActorEntity2);

describe('GameLoopService', () => {
  let service: GameLoopService;

  beforeEach(() => {
    setupMocks();

    when(mockedLoggingHub.logMessageProduced$).thenReturn(EMPTY);

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

  describe('when player inventory changes', () => {
    [
      {
        invEvent: new InventoryEvent(
          'STORE',
          playerInfo.id,
          consumableFirstAid
        ),
        expected: new ActionableItemDefinition(
          consumableFirstAid,
          consumeActionable
        ),
        item: consumableFirstAid,
      },
      {
        invEvent: new InventoryEvent('STORE', playerInfo.id, unDodgeableAxe),
        expected: new ActionableItemDefinition(unDodgeableAxe, equipActionable),
        item: unDodgeableAxe,
      },
      {
        invEvent: new InventoryEvent('STORE', playerInfo.id, discardKey),
        expected: new ActionableItemDefinition(
          discardKey,
          createActionableDefinition(
            'USE',
            discardKey.identity.name,
            discardKey.identity.label
          )
        ),
        item: discardKey,
      },
      {
        invEvent: new InventoryEvent('STORE', playerInfo.id, readable),
        expected: new ActionableItemDefinition(readable, readActionable),
        item: readable,
      },
    ].forEach(({ invEvent, expected, item }) => {
      it(`should emit event ${invEvent.eventName}`, (done) => {
        let result: ArrayView<ActionableItemDefinition> | undefined;

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

const eventAttackInteractive = actionableEvent(
  affectActionable,
  interactiveInfo.id
);

const documentSubject = new Subject<ReadableDefinition>();

const inventoryEventSubject = new Subject<InventoryEvent>();

const eventEquipUnDodgeableAxe = actionableEvent(
  equipActionable,
  unDodgeableAxe.identity.name
);

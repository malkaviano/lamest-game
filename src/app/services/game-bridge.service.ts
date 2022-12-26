import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs';

import { CharacterService } from './character.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import { NarrativeService } from './narrative.service';
import { ActionableEvent } from '../events/actionable.event';
import { ArrayView } from '../views/array.view';
import { InventoryService } from './inventory.service';
import { ActionableItemView } from '../views/actionable-item.view';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { GameRoundService } from './game-round.service';
import { PlayerEntity } from '../entities/player.entity';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { EventHubHelperService } from '../helpers/event-hub.helper.service';

@Injectable({
  providedIn: 'root',
})
export class GameBridgeService {
  public readonly player: PlayerEntity;

  public readonly events: GameEventsDefinition;

  constructor(
    gameRoundService: GameRoundService,
    characterService: CharacterService,
    narrativeService: NarrativeService,
    inventoryService: InventoryService,
    eventHubHelperService: EventHubHelperService
  ) {
    this.player = characterService.currentCharacter;

    const inventoryChanged = inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === this.player.id),
      map(() => {
        const items = this.playerInventory(inventoryService);

        return items;
      })
    );

    this.events = new GameEventsDefinition(
      narrativeService.sceneChanged$,
      eventHubHelperService.logMessageProduced$,
      characterService.characterChanged$,
      inventoryChanged,
      gameRoundService.documentOpened$,
      this.player.canActChanged$
    );

    gameRoundService.run();

    (() =>
      setInterval(() => {
        gameRoundService.run();
      }, 200))();
  }

  public actionableReceived(action: ActionableEvent): void {
    this.player.playerDecision(action);
  }

  private playerInventory(
    inventoryService: InventoryService
  ): ArrayView<ActionableItemView> {
    const playerItems = inventoryService.list(this.player.id);

    const inventoryView: ActionableItemView[] = [];

    const items = playerItems.items.reduce((acc, itemStorage) => {
      for (let index = 0; index < itemStorage.quantity; index++) {
        acc.push(
          ActionableItemView.create(
            itemStorage.item,
            this.inventoryAction(itemStorage.item)
          )
        );
      }

      return acc;
    }, inventoryView);

    return ArrayView.create([...items]);
  }

  private inventoryAction(item: GameItemDefinition): ActionableDefinition {
    if (item.category === 'WEAPON') {
      return createActionableDefinition('EQUIP', 'equip', 'Equip');
    }

    if (item.category === 'CONSUMABLE') {
      return createActionableDefinition('CONSUME', 'consume', 'Consume');
    }

    if (item.category === 'READABLE') {
      return createActionableDefinition('INSPECT', 'inspect', 'Inspect');
    }

    return createActionableDefinition('NOOP', 'noop', 'NOOP');
  }
}

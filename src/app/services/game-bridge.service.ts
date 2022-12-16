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
import { GameLoopService } from './game-loop.service';
import { LoggingService } from './logging.service';
import { PlayerEntity } from '../entities/player.entity';
import { GameItemDefinition } from '../definitions/game-item.definition';

@Injectable({
  providedIn: 'root',
})
export class GameBridgeService {
  public readonly player: PlayerEntity;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly gameLoopService: GameLoopService,
    characterService: CharacterService,
    narrativeService: NarrativeService,
    inventoryService: InventoryService,
    loggingService: LoggingService
  ) {
    this.player = characterService.currentCharacter;

    const inventoryChanged = inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === this.player.name),
      map(() => {
        const items = this.playerInventory(inventoryService);

        return items;
      })
    );

    this.events = new GameEventsDefinition(
      narrativeService.sceneChanged$,
      loggingService.gameLog$,
      characterService.characterChanged$,
      inventoryChanged,
      this.gameLoopService.documentOpened$
    );
  }

  public actionableReceived(action: ActionableEvent): void {
    this.player.playerDecision(action);

    this.gameLoopService.run();
  }

  private playerInventory(
    inventoryService: InventoryService
  ): ArrayView<ActionableItemView> {
    const playerItems = inventoryService.check(this.player.name);

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

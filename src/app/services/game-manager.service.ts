import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs';

import { CharacterManagerService } from '../services/character-manager.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import { NarrativeService } from './narrative.service';
import { ActionableEvent } from '../events/actionable.event';
import { ArrayView } from '../views/array.view';
import { InventoryService } from './inventory.service';
import { ActionableItemDefinition } from '../definitions/actionable-item.definition';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { GameItemLiteral } from '../literals/game-item.literal';
import { GameLoopService } from './game-loop.service';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  public readonly events: GameEventsDefinition;

  constructor(
    private readonly gameLoopService: GameLoopService,
    private readonly characterManagerService: CharacterManagerService,
    private readonly narrativeService: NarrativeService,
    private readonly inventoryService: InventoryService,
    private readonly loggingService: LoggingService
  ) {
    const observable = this.inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === 'player'),
      map((_) => {
        const equipped = this.inventoryService.equipped;

        const items = this.playerInventory();

        return { items, equipped };
      })
    );

    this.events = new GameEventsDefinition(
      this.narrativeService.sceneChanged$,
      this.loggingService.gameLog$,
      this.characterManagerService.characterChanged$,
      observable
    );
  }

  public actionableReceived(action: ActionableEvent): void {
    this.gameLoopService.run(action);
  }

  private playerInventory(): ArrayView<ActionableItemDefinition> {
    const playerItems = this.inventoryService.check('player');

    const inventoryView: ActionableItemDefinition[] = [];

    const items = playerItems.items.reduce((acc, itemStorage) => {
      for (let index = 0; index < itemStorage.quantity; index++) {
        acc.push(
          new ActionableItemDefinition(
            itemStorage.item,
            this.inventoryAction(itemStorage.item.category)
          )
        );
      }

      return acc;
    }, inventoryView);

    return new ArrayView([...items]);
  }

  private inventoryAction(category: GameItemLiteral): ActionableDefinition {
    if (category === 'WEAPON') {
      return createActionableDefinition('EQUIP', 'equip', 'Equip');
    }

    return createActionableDefinition('USE', 'use', 'Use');
  }
}

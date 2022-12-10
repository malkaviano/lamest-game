import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs';

import { CharacterService } from './character.service';
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
  public readonly playerName: string;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly gameLoopService: GameLoopService,
    characterService: CharacterService,
    narrativeService: NarrativeService,
    inventoryService: InventoryService,
    private readonly loggingService: LoggingService
  ) {
    this.playerName = characterService.currentCharacter.name;

    const inventoryChanged = inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === this.playerName),
      map(() => {
        const items = this.playerInventory(inventoryService);

        return items;
      })
    );

    this.events = new GameEventsDefinition(
      narrativeService.sceneChanged$,
      this.loggingService.gameLog$,
      characterService.characterChanged$,
      inventoryChanged
    );
  }

  public actionableReceived(action: ActionableEvent): void {
    const result = this.gameLoopService.run(action);

    result.logs.forEach((log) => this.loggingService.log(log));
  }

  private playerInventory(
    inventoryService: InventoryService
  ): ArrayView<ActionableItemDefinition> {
    const playerItems = inventoryService.check(this.playerName);

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

    return createActionableDefinition('CONSUME', 'consume', 'Consume');
  }
}

import { Injectable } from '@angular/core';

import { filter, map, Observable, Subject } from 'rxjs';

import { CharacterManagerService } from '../services/character-manager.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import { ResultLiteral } from '../literals/result.literal';
import { NarrativeService } from './narrative.service';
import { RandomIntService } from './random-int.service';
import { ActionableEvent } from '../events/actionable.event';
import { ArrayView } from '../views/array.view';
import { InventoryService } from './inventory.service';
import { ActionableItemDefinition } from '../definitions/actionable-item.definition';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { GameItemLiteral } from '../literals/game-item.literal';
import { GameItemDefinition } from '../definitions/game-item.definition';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private readonly gameLog: Subject<string>;

  public readonly playerInventory$: Observable<{
    items: ArrayView<ActionableItemDefinition>;
    equipped: GameItemDefinition | null;
  }>;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly narrativeService: NarrativeService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.playerInventory$ = this.inventoryService.inventoryChanged$.pipe(
      filter((event) => event.storageName === 'player'),
      map((_) => {
        const equipped = this.inventoryService.equipped;

        const items = this.playerInventory();

        return { items, equipped };
      })
    );

    this.events = new GameEventsDefinition(
      this.narrativeService.sceneChanged$,
      this.gameLog.asObservable(),
      this.characterManagerService.characterChanged$,
      this.playerInventory$,
      (action: ActionableEvent) => this.actionableReceived(action)
    );
  }

  private actionableReceived(action: ActionableEvent): void {
    let result: ResultLiteral = 'NONE';

    if (action.actionableDefinition.actionable === 'SKILL') {
      const skillName = action.actionableDefinition.name;
      const skillValue =
        this.characterManagerService.currentCharacter.skills[skillName];

      if (skillValue) {
        const roll = this.rngService.getRandomInterval(1, 100);

        result = roll <= skillValue ? 'SUCCESS' : 'FAILURE';

        this.gameLog.next(`rolled: ${skillName} -> ${roll} -> ${result}`);
      }
    } else if (action.actionableDefinition.actionable === 'PICK') {
      const item = this.inventoryService.take(
        action.eventId,
        action.actionableDefinition.name
      );

      this.inventoryService.store('player', item);
    } else if (action.actionableDefinition.actionable === 'EQUIP') {
      this.inventoryService.equip(action.eventId);

      this.gameLog.next(`equipped: ${this.inventoryService.equipped?.label}`);
    } else if (action.actionableDefinition.actionable === 'USE') {
      console.log(action.actionableDefinition, action.eventId);
    } else if (action.actionableDefinition.actionable === 'UNEQUIP') {
      this.inventoryService.unequip();

      this.gameLog.next(`unequipped: ${action.actionableDefinition.label}`);
    }

    if (
      !['UNEQUIP', 'EQUIP', 'USE'].includes(
        action.actionableDefinition.actionable
      )
    ) {
      const interactive = this.narrativeService.run(action, result);

      this.gameLog.next(
        `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
      );
    }
  }

  private playerInventory(): ArrayView<ActionableItemDefinition> {
    const playerItems = this.inventoryService.check('player');

    const inventoryView: ActionableItemDefinition[] = [];

    const items = playerItems.items.reduce((acc, itemStorage) => {
      for (let index = 0; index < itemStorage.quantity; index++) {
        acc.push(
          new ActionableItemDefinition(
            itemStorage.item,
            this.itemAction(itemStorage.item.category)
          )
        );
      }

      return acc;
    }, inventoryView);

    return new ArrayView([...items]);
  }

  private itemAction(category: GameItemLiteral): ActionableDefinition {
    if (category === 'WEAPON') {
      return createActionableDefinition('EQUIP', 'equip', 'Equip');
    }

    return createActionableDefinition('USE', 'use', 'Use');
  }
}

import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { CharacterManagerService } from '../services/character-manager.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import { ResultLiteral } from '../literals/result.literal';
import { NarrativeService } from './narrative.service';
import { RandomIntService } from './random-int.service';
import { ActionableEvent } from '../events/actionable.event';
import { ArrayView } from '../views/array.view';
import { InventoryService } from './inventory.service';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableItemDefinition } from '../definitions/actionable-item.definition';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { GameItemLiteral } from '../literals/game-item.literal';
import { ConsumableDefinition } from '../definitions/consumable.definition';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private readonly gameLog: Subject<string>;

  private readonly playerInventory: Subject<
    ArrayView<ActionableItemDefinition>
  >;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly narrativeService: NarrativeService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.playerInventory = new Subject<ArrayView<ActionableItemDefinition>>();

    this.events = new GameEventsDefinition(
      this.narrativeService.sceneChanged$,
      this.gameLog.asObservable(),
      this.characterManagerService.characterChanged$,
      this.playerInventory.asObservable(),
      (action: ActionableEvent) => this.actionableReceived(action)
    );

    this.inventoryService.store(
      'upperShelf',
      new WeaponDefinition(
        'knife',
        'Hunting Knife',
        'A knife used by hunters mostly'
      )
    );

    this.inventoryService.store(
      'upperShelf',
      new ConsumableDefinition('firstAid', 'First Aid Kit', 'Use to recover HP')
    );

    this.inventoryService.store(
      'upperShelf',
      new ConsumableDefinition('firstAid', 'First Aid Kit', 'Use to recover HP')
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
        action.interactiveId,
        action.actionableDefinition.name
      );

      this.inventoryService.store('player', item);

      let inventoryView: ActionableItemDefinition[] = [];

      const playerItems = this.inventoryService.check('player');

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

      this.playerInventory.next(new ArrayView([...items]));
    } else if (action.actionableDefinition.actionable === 'EQUIP') {
      console.log(action.actionableDefinition, action.interactiveId);

      return;
    } else if (action.actionableDefinition.actionable === 'USE') {
      console.log(action.actionableDefinition, action.interactiveId);

      return;
    }

    const interactive = this.narrativeService.run(action, result);

    this.gameLog.next(
      `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
    );
  }

  private itemAction(category: GameItemLiteral): ActionableDefinition {
    if (category === 'WEAPON') {
      return createActionableDefinition('EQUIP', 'equip', 'Equip');
    }

    return createActionableDefinition('USE', 'use', 'Use');
  }
}

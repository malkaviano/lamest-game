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
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private readonly gameLog: Subject<string>;

  private readonly playerInventory: Subject<ArrayView<ItemStorageDefinition>>;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly narrativeService: NarrativeService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.playerInventory = new Subject<ArrayView<ItemStorageDefinition>>();

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
      new WeaponDefinition('firstAid', 'First Aid Kit', 'Use to recover HP')
    );

    this.inventoryService.store(
      'upperShelf',
      new WeaponDefinition('firstAid', 'First Aid Kit', 'Use to recover HP')
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

      this.playerInventory.next(this.inventoryService.check('player'));
    }

    const interactive = this.narrativeService.run(action, result);

    this.gameLog.next(
      `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
    );
  }
}

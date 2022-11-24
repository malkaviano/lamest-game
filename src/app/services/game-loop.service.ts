import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ActionableEvent } from '../events/actionable.event';
import { ResultLiteral } from '../literals/result.literal';
import { ItemStore } from '../stores/item.store';
import { CharacterManagerService } from './character-manager.service';
import { InventoryService } from './inventory.service';
import { NarrativeService } from './narrative.service';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly gameLog: Subject<string>;

  private readonly dispatcher: {
    [key: string]: (actionableEvent: ActionableEvent) => void;
  };

  public readonly gameLog$: Observable<string>;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly narrativeService: NarrativeService,
    private readonly inventoryService: InventoryService,
    private readonly itemStore: ItemStore,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.gameLog$ = this.gameLog.asObservable();

    this.dispatcher = {
      SKILL: (action: ActionableEvent): void => {
        const skillName = action.actionableDefinition.name;
        const skillValue =
          this.characterManagerService.currentCharacter.skills[skillName];

        let result: ResultLiteral = 'NONE';

        if (skillValue) {
          const roll = this.rngService.getRandomInterval(1, 100);

          result = roll <= skillValue ? 'SUCCESS' : 'FAILURE';

          this.gameLog.next(`rolled: ${skillName} -> ${roll} -> ${result}`);
        }

        const interactive = this.narrativeService.run(action, result);

        this.gameLog.next(
          `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
        );
      },
      PICK: (action: ActionableEvent): void => {
        const item = this.inventoryService.take(
          action.eventId,
          action.actionableDefinition.name
        );

        this.inventoryService.store('player', item);

        const interactive = this.narrativeService.run(action, 'NONE');

        this.gameLog.next(
          `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
        );
      },
      EQUIP: (action: ActionableEvent): void => {
        const skillName = this.itemStore.itemSkill(action.eventId);

        if (
          skillName &&
          this.characterManagerService.currentCharacter.skills[skillName] > 0
        ) {
          this.inventoryService.equip(action.eventId);

          this.gameLog.next(
            `equipped: ${this.inventoryService.equipped?.label}`
          );
        } else {
          this.gameLog.next(
            `error: ${skillName} is required to equip ${action.eventId}`
          );
        }
      },
      USE: (action: ActionableEvent): void => {
        console.log(action.actionableDefinition, action.eventId);
      },
      UNEQUIP: (action: ActionableEvent): void => {
        this.inventoryService.unequip();

        this.gameLog.next(`unequipped: ${action.actionableDefinition.label}`);
      },
      SCENE: (action: ActionableEvent): void => {
        const interactive = this.narrativeService.run(action, 'NONE');

        this.gameLog.next(
          `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
        );
      },
    };
  }

  public run(action: ActionableEvent): void {
    this.dispatcher[action.actionableDefinition.actionable](action);
  }
}

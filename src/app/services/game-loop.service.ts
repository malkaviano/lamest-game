import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ActionableEvent } from '../events/actionable.event';
import { ResultLiteral } from '../literals/result.literal';
import { CharacterManagerService } from './character-manager.service';
import { InventoryService } from './inventory.service';
import { NarrativeService } from './narrative.service';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private readonly gameLog: Subject<string>;

  public readonly gameLog$: Observable<string>;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly narrativeService: NarrativeService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.gameLog$ = this.gameLog.asObservable();
  }

  public run(action: ActionableEvent): void {
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
}

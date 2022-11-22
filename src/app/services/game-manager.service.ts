import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { CharacterManagerService } from '../services/character-manager.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import { ResultLiteral } from '../literals/result.literal';
import { NarrativeService } from './narrative.service';
import { RandomIntService } from './random-int.service';
import { ActionableEvent } from '../events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private readonly gameLog: Subject<string>;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly sceneManagerService: NarrativeService,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.events = new GameEventsDefinition(
      this.sceneManagerService.sceneChanged$,
      this.gameLog.asObservable(),
      this.characterManagerService.characterChanged$,
      (action: ActionableEvent) => this.actionableReceived(action)
    );
  }

  private actionableReceived(action: ActionableEvent): void {
    let result: ResultLiteral = 'NONE';

    if (action.actionableDefinition.actionable === 'SKILL') {
      const skillName = action.actionableDefinition.name;
      const skillValue =
        this.characterManagerService.currentCharacter.skills[skillName];

      console.log(
        skillName,
        skillValue,
        this.characterManagerService.currentCharacter.skills
      );

      if (skillValue) {
        const roll = this.rngService.getRandomInterval(1, 100);

        result = roll <= skillValue ? 'SUCCESS' : 'FAILURE';

        this.gameLog.next(`rolled: ${skillName} -> ${roll} -> ${result}`);
      }
    }

    const interactive = this.sceneManagerService.run(action, result);

    this.gameLog.next(
      `selected: ${interactive.name} -> ${action.actionableDefinition.label}`
    );
  }
}

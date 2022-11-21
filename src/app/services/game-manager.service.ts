import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { CharacterManagerService } from '../services/character-manager.service';
import { GameEventsDefinition } from '../definitions/game-events.definition';
import { ResultLiteral } from '../literals/result.literal';
import { SceneManagerService } from './scene-manager.service';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private readonly gameLog: Subject<string>;

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly sceneManagerService: SceneManagerService,
    private readonly rngService: RandomIntService
  ) {
    this.gameLog = new Subject<string>();

    this.events = new GameEventsDefinition(
      this.sceneManagerService.sceneChanged$,
      this.gameLog.asObservable(),
      this.characterManagerService.characterChanged$,
      (action: ActionableDefinition) => this.actionableReceived(action)
    );
  }

  private actionableReceived(action: ActionableDefinition): void {
    let result: ResultLiteral = 'NONE';

    if (action.actionable === 'SKILL') {
      const skillName = action.name;
      const skillValue =
        this.characterManagerService.currentCharacter.skills[skillName];

      if (skillValue) {
        const roll = this.rngService.getRandomInterval(1, 100);

        result = roll <= skillValue ? 'SUCCESS' : 'FAILURE';

        this.gameLog.next(`rolled: ${skillName} -> ${roll} -> ${result}`);
      }
    }

    const interactive = this.sceneManagerService.run(action, result);

    this.gameLog.next(`selected: ${interactive.name} -> ${action.label}`);
  }
}

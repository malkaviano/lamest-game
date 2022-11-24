import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { ResultLiteral } from '../literals/result.literal';
import { CharacterManagerService } from '../services/character-manager.service';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule implements RuleInterface {
  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const skillName = action.actionableDefinition.name;
    const skillValue =
      this.characterManagerService.currentCharacter.skills[skillName];

    let result: ResultLiteral = 'NONE';

    if (skillValue) {
      const roll = this.rngService.getRandomInterval(1, 100);

      result = roll <= skillValue ? 'SUCCESS' : 'FAILURE';

      this.loggingService.log(`rolled: ${skillName} -> ${roll} -> ${result}`);
    }

    const interactive = this.narrativeService.run(action, result);

    this.loggingService.log(
      `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
    );
  }
}

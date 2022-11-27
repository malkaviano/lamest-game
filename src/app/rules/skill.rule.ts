import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule implements RuleInterface {
  constructor(
    private readonly characterManagerService: CharacterService,
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    const skillName = action.actionableDefinition.name;

    const skillValue =
      this.characterManagerService.currentCharacter.skills[skillName];

    const { roll, result } = this.rngService.checkSkill(skillValue);

    const interactive = this.narrativeService.interatives[action.eventId];

    interactive.actionSelected(action.actionableDefinition, result);

    logs.push(
      `selected: ${interactive.name} -> ${action.actionableDefinition.actionable} -> ${action.actionableDefinition.label}`
    );

    if (roll) {
      logs.push(`rolled: ${skillName} -> ${roll} -> ${result}`);
    }

    return { logs };
  }
}

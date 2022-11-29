import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule implements RuleInterface {
  constructor(
    private readonly characterService: CharacterService,
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: string[] = [];

    const skillName = action.actionableDefinition.name;

    const skillValue = this.characterService.currentCharacter.skills[skillName];

    const { roll, result } = this.rngService.checkSkill(skillValue);

    const interactive = this.narrativeService.interatives[action.eventId];

    interactive.actionSelected(action.actionableDefinition, result);

    logs.push(
      `player: used ${action.actionableDefinition.label} on ${interactive.name}`
    );

    if (roll) {
      logs.push(`player: rolled ${roll} -> ${result}`);
    }

    return { logs };
  }
}

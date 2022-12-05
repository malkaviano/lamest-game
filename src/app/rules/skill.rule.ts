import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';

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
    const logs: LogMessageDefinition[] = [];

    const skillName = action.actionableDefinition.name as SkillNameLiteral;

    const skillValue = this.characterService.currentCharacter.skills[skillName];

    if (skillValue) {
      const { roll, result } = this.rngService.checkSkill(skillValue);

      const interactive = this.narrativeService.interatives[action.eventId];

      interactive.actionSelected(action.actionableDefinition, result);

      if (roll) {
        logs.push(createCheckLogMessage('player', skillName, roll, result));
      }
    } else {
      logs.push(createCannotCheckLogMessage('player', skillName));
    }

    return { logs };
  }
}

import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { RollService } from '../services/roll.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule implements RuleInterface {
  constructor(
    private readonly characterService: CharacterService,
    private readonly rollRule: RollService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const skillName = action.actionableDefinition.name as SkillNameLiteral;

    const { roll, result } = this.rollRule.actorSkillCheck(
      this.characterService.currentCharacter,
      skillName
    );

    if (result !== 'IMPOSSIBLE') {
      logs.push(createCheckLogMessage('player', skillName, roll, result));

      const interactive = this.narrativeService.interatives[action.eventId];

      const log = interactive.reactTo(action.actionableDefinition, result);

      if (log) {
        logs.push(createFreeLogMessage(interactive.name, log));
      }
    } else {
      logs.push(createCannotCheckLogMessage('player', skillName));
    }

    return { logs };
  }
}

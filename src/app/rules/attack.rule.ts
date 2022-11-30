import { Injectable } from '@angular/core';

import { unarmed } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';
import {
  createCheckLogMessage,
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class AttackRule implements RuleInterface {
  constructor(
    private readonly characterService: CharacterService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const weapon = this.inventoryService.equipped ?? unarmed;

    const skillValue =
      this.characterService.currentCharacter.skills[weapon.skillName];

    if (skillValue) {
      const { roll, result } = this.rngService.checkSkill(skillValue);

      const interactive = this.narrativeService.interatives[action.eventId];

      logs.push(
        createCheckLogMessage('player', weapon.skillName, roll, result)
      );

      if (result === 'SUCCESS') {
        const weaponDamage = weapon.damage;

        const damage =
          this.rngService.roll(weaponDamage.diceRoll) + weaponDamage.fixed;

        const log = interactive.actionSelected(
          action.actionableDefinition,
          result,
          damage
        );

        if (log) {
          logs.push(createFreeLogMessage(interactive.name, log));
        }
      }
    }

    return { logs };
  }
}

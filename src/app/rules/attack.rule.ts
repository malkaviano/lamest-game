import { Injectable } from '@angular/core';

import { unarmed } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
  createLostLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { CharacterService } from '../services/character.service';

@Injectable({
  providedIn: 'root',
})
export class AttackRule implements RuleInterface {
  constructor(
    private readonly rollRule: RollService,
    private readonly characterService: CharacterService,
    private readonly inventoryService: InventoryService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const weapon = this.inventoryService.equipped ?? unarmed;

    const { roll, result } = this.rollRule.actorSkillCheck(
      this.characterService.currentCharacter,
      weapon.skillName
    );

    if (result !== 'IMPOSSIBLE') {
      const interactive = this.narrativeService.interatives[action.eventId];

      logs.push(
        createCheckLogMessage('player', weapon.skillName, roll, result)
      );

      if (weapon.usability === 'DISPOSABLE') {
        this.inventoryService.dispose();

        logs.push(createLostLogMessage('player', weapon.label));
      }

      if (result === 'SUCCESS') {
        const weaponDamage = weapon.damage;

        const damage =
          this.rollRule.roll(weaponDamage.diceRoll) + weaponDamage.fixed;

        const log = interactive.reactTo(
          action.actionableDefinition,
          result,
          damage
        );

        if (log) {
          logs.push(createFreeLogMessage(interactive.name, log));
        }
      }
    } else {
      logs.push(createCannotCheckLogMessage('player', weapon.skillName));
    }

    return { logs };
  }
}

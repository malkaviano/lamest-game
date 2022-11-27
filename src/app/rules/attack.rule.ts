import { Injectable } from '@angular/core';

import { unarmed } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class AttackRule implements RuleInterface {
  constructor(
    private readonly characterManagerService: CharacterService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    const weapon = this.inventoryService.equipped ?? unarmed;

    const skillValue =
      this.characterManagerService.currentCharacter.skills[weapon.skillName];

    if (skillValue) {
      const { roll, result } = this.rngService.checkSkill(skillValue);

      const interactive = this.narrativeService.interatives[action.eventId];

      logs.push(`attack: ${interactive.name} USING ${weapon.label}`);

      logs.push(`rolled: ${weapon.skillName} -> ${roll} -> ${result}`);

      let damage: number | undefined;

      if (result === 'SUCCESS') {
        const weaponDamage = weapon.damage;

        damage =
          this.rngService.roll(weaponDamage.diceRoll) + weaponDamage.fixed;

        logs.push(`attack: ${weapon.label} for ${damage} damage`);
      }

      const log = interactive.actionSelected(
        action.actionableDefinition,
        result,
        damage
      );

      if (log) {
        logs.push(`${interactive.name}: ${log}`);
      }
    }

    return { logs };
  }
}

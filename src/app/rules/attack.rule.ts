import { Injectable } from '@angular/core';

import { unarmed } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

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
    const logs: string[] = [];

    const weapon = this.inventoryService.equipped ?? unarmed;

    const skillValue =
      this.characterService.currentCharacter.skills[weapon.skillName];

    if (skillValue) {
      const { roll, result } = this.rngService.checkSkill(skillValue);

      const interactive = this.narrativeService.interatives[action.eventId];

      logs.push(`player: attacked ${interactive.name} USING ${weapon.label}`);

      logs.push(
        `player: used ${weapon.skillName} and rolled ${roll} -> ${result}`
      );

      let damage: number | undefined;

      if (result === 'SUCCESS') {
        const weaponDamage = weapon.damage;

        damage =
          this.rngService.roll(weaponDamage.diceRoll) + weaponDamage.fixed;

        const log = interactive.actionSelected(
          action.actionableDefinition,
          result,
          damage
        );

        if (log) {
          const preposition = log.includes('destroyed') ? 'by' : 'from';

          logs.push(
            `${interactive.name}: ${log} ${preposition} player ${weapon.label}`
          );
        }
      }
    }

    return { logs };
  }
}

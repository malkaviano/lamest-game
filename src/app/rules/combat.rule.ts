import { Injectable } from '@angular/core';

import { unarmed } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { CharacterManagerService } from '../services/character-manager.service';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class CombatRule implements RuleInterface {
  constructor(
    private readonly characterManagerService: CharacterManagerService,
    private readonly inventoryService: InventoryService,
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const weapon = this.inventoryService.equipped ?? unarmed;

    const skillValue =
      this.characterManagerService.currentCharacter.skills[weapon.skillName];

    const { roll, result } = this.rngService.checkSkill(skillValue);

    const interactive = this.narrativeService.run(action, result);

    this.loggingService.log(
      `attack: ${interactive.name} USING ${weapon.label}`
    );

    const msg = roll
      ? `rolled: ${weapon.skillName} -> ${roll} -> ${result}`
      : 'automatic failure, not skill points';

    this.loggingService.log(msg);

    if (result === 'SUCCESS') {
      const weaponDamage = weapon.damage;

      const damage =
        this.rngService.roll(weaponDamage.diceRoll) + weaponDamage.fixed;

      this.loggingService.log(`attack: ${weapon.label} did ${damage} damage`);
    }
  }
}

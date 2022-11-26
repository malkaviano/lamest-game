import { Injectable } from '@angular/core';
import { ConsumableDefinition } from '../definitions/consumable.definition';
import { errorMessages } from '../definitions/error-messages.definition';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly characterService: CharacterService,
    private readonly rngService: RandomIntService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    const consumable = this.inventoryService.take(
      'player',
      action.eventId
    ) as ConsumableDefinition;

    if (consumable.category !== 'CONSUMABLE') {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    this.loggingService.log(`player: consumed ${consumable.label}`);

    let hp = consumable.hp;

    if (consumable.skillName) {
      const skillValue =
        this.characterService.currentCharacter.skills[consumable.skillName];

      const { result, roll } = this.rngService.checkSkill(skillValue);

      if (roll) {
        this.loggingService.log(
          `rolled: ${consumable.skillName} -> ${roll} -> ${result}`
        );
      }

      if (result === 'FAILURE') {
        hp = 0;
      }
    }

    const log = this.characterService.currentCharacter.healed(hp);

    this.loggingService.log(log);
  }
}

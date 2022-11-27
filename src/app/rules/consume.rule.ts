import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly characterService: CharacterService,
    private readonly rngService: RandomIntService
  ) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    const consumable = this.inventoryService.take(
      'player',
      action.eventId
    ) as ConsumableDefinition;

    if (consumable.category !== 'CONSUMABLE') {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    logs.push(`player: consumed ${consumable.label}`);

    let hp = consumable.hp;

    if (consumable.skillName) {
      const skillValue =
        this.characterService.currentCharacter.skills[consumable.skillName];

      const { result, roll } = this.rngService.checkSkill(skillValue);

      if (roll) {
        logs.push(
          `player: rolled ${roll} in ${consumable.skillName} and resulted in ${result}`
        );
      }

      if (result === 'SUCCESS') {
        const log = this.characterService.currentCharacter.healed(hp);

        logs.push(`player: ${log}`);
      }
    }

    return { logs };
  }
}

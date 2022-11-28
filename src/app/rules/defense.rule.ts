import { Injectable } from '@angular/core';
import { ActionableEvent } from '../events/actionable.event';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResult } from '../results/rule.result';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class DefenseRule implements RuleInterface {
  constructor(
    private readonly rngService: RandomIntService,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(action: ActionableEvent): RuleResult {
    const logs: string[] = [];

    Object.entries(this.narrativeService.interatives).forEach(
      ([_, interactive]) => {
        const attack = interactive.attack;

        if (attack) {
          const { skillValue, damage } = attack;

          let { result: enemyResult } = this.rngService.checkSkill(skillValue);

          if (enemyResult === 'SUCCESS') {
            logs.push(`${interactive.name}: attacked player`);

            const { result } = this.rngService.checkSkill(
              this.characterService.currentCharacter.skills['Dodge']
            );

            if (result === 'FAILURE') {
              const damageAmount =
                this.rngService.roll(damage.diceRoll) + damage.fixed;

              const log =
                this.characterService.currentCharacter.damaged(damageAmount);

              logs.push(`${log}`);
            } else {
              logs.push(`player: dodged ${interactive.name} attack`);
            }
          } else {
            logs.push(`${interactive.name}: attacked player but missed`);
          }
        }
      }
    );

    return { logs };
  }
}

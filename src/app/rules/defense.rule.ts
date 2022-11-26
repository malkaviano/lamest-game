import { Injectable } from '@angular/core';
import { ActionableEvent } from '../events/actionable.event';

import { RuleInterface } from '../interfaces/rule.interface';
import { CharacterService } from '../services/character.service';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class DefenseRule implements RuleInterface {
  constructor(
    private readonly rngService: RandomIntService,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    Object.entries(this.narrativeService.interatives).forEach(
      ([_, interactive]) => {
        const attack = interactive.attack;

        if (attack) {
          const { skillValue, damage } = attack;

          let { result: enemyResult } = this.rngService.checkSkill(skillValue);

          const enemyLog = enemyResult === 'SUCCESS' ? 'hit' : 'missed';

          this.loggingService.log(
            `${interactive.name} attacks Player: ${enemyLog}`
          );

          if (enemyResult === 'SUCCESS') {
            const { result } = this.rngService.checkSkill(
              this.characterService.currentCharacter.skills['Dodge']
            );

            if (result === 'FAILURE') {
              const damageAmount =
                this.rngService.roll(damage.diceRoll) + damage.fixed;

              const log =
                this.characterService.currentCharacter.damaged(damageAmount);

              this.loggingService.log(
                `${interactive.name} did ${damageAmount} damage to Player`
              );

              this.loggingService.log(`player: ${log}`);
            } else {
              this.loggingService.log(
                `dodge: Player avoided ${interactive.name} attack`
              );
            }
          }
        }
      }
    );
  }
}

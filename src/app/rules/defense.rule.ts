import { Injectable } from '@angular/core';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';
import {
  createFreeLogMessage,
  createAttackedLogMessage,
  createDamagedMessage,
  LogMessageDefinition,
  createMissedAttackLogMessage,
  createDodgedLogMessage as createDodgedAttackLogMessage,
} from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class DefenseRule implements RuleInterface {
  constructor(
    private readonly rngService: RandomIntService,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    Object.entries(this.narrativeService.interatives).forEach(
      ([, interactive]) => {
        const attack = interactive.attack;

        if (attack) {
          const { skillValue, damage, dodgeable, weaponName } = attack;

          const { result: enemyResult } =
            this.rngService.checkSkill(skillValue);

          if (enemyResult === 'SUCCESS') {
            logs.push(
              createAttackedLogMessage(interactive.name, 'player', weaponName)
            );

            const { result } = this.rngService.checkSkill(
              this.characterService.currentCharacter.skills['Dodge']
            );

            if (!dodgeable || result === 'FAILURE') {
              const damageAmount =
                this.rngService.roll(damage.diceRoll) + damage.fixed;

              const damaged =
                this.characterService.currentCharacter.damaged(damageAmount);

              logs.push(
                createFreeLogMessage('player', createDamagedMessage(damaged))
              );
            } else {
              logs.push(
                createDodgedAttackLogMessage('player', interactive.name)
              );
            }
          } else {
            logs.push(createMissedAttackLogMessage(interactive.name, 'player'));
          }
        }
      }
    );

    return { logs };
  }
}

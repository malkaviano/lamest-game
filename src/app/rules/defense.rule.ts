import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
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

  public execute(action: ActionableEvent): RuleResultInterface {
    const logs: string[] = [];

    Object.entries(this.narrativeService.interatives).forEach(
      ([_, interactive]) => {
        const attack = interactive.attack(action.actionableDefinition);

        if (attack) {
          const { skillValue, damage, dodgeable, weaponName } = attack;

          let { result: enemyResult } = this.rngService.checkSkill(skillValue);

          if (enemyResult === 'SUCCESS') {
            logs.push(`${interactive.name}: attacked player`);

            const { result } = this.rngService.checkSkill(
              this.characterService.currentCharacter.skills['Dodge']
            );

            if (!dodgeable || result === 'FAILURE') {
              const damageAmount =
                this.rngService.roll(damage.diceRoll) + damage.fixed;

              const log =
                this.characterService.currentCharacter.damaged(damageAmount);

              const preposition = log.includes('killed') ? 'by' : 'from';

              logs.push(
                `player: ${log} ${preposition} ${interactive.name} ${weaponName}`
              );
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

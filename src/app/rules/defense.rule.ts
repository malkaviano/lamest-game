import { Injectable } from '@angular/core';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import {
  createFreeLogMessage,
  createAttackedLogMessage,
  createDamagedMessage,
  LogMessageDefinition,
  createMissedAttackLogMessage,
  createDodgedLogMessage as createDodgedAttackLogMessage,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { ActorEntity } from '../entities/actor.entity';

@Injectable({
  providedIn: 'root',
})
export class DefenseRule implements RuleInterface {
  constructor(
    private readonly rollRule: RollService,
    private readonly characterService: CharacterService,
    private readonly narrativeService: NarrativeService
  ) {}

  public execute(): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    Object.entries(this.narrativeService.interatives).forEach(
      ([, interactive]) => {
        if (interactive instanceof ActorEntity) {
          const attack = interactive.attack;

          if (attack) {
            const {
              skillValue,
              weapon: { dodgeable, damage, label: weaponName },
            } = attack;

            const { result: enemyResult } =
              this.rollRule.skillCheck(skillValue);

            if (enemyResult === 'SUCCESS') {
              logs.push(
                createAttackedLogMessage(interactive.name, 'player', weaponName)
              );

              const { result } = this.rollRule.actorSkillCheck(
                this.characterService.currentCharacter,
                'Dodge'
              );

              if (!dodgeable || result === 'FAILURE') {
                const damageAmount =
                  this.rollRule.roll(damage.diceRoll) + damage.fixed;

                const damaged =
                  this.characterService.currentCharacter.damaged(damageAmount);

                logs.push(
                  createFreeLogMessage(
                    'player',
                    createDamagedMessage(damaged.effective)
                  )
                );
              } else {
                logs.push(
                  createDodgedAttackLogMessage('player', interactive.name)
                );
              }
            } else {
              logs.push(
                createMissedAttackLogMessage(interactive.name, 'player')
              );
            }
          }
        }
      }
    );

    return { logs };
  }
}

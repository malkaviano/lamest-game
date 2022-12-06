import { Injectable } from '@angular/core';

import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import {
  createFreeLogMessage,
  createAttackedLogMessage,
  LogMessageDefinition,
  createMissedAttackLogMessage,
  createDodgedMessage,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { NpcEntity } from '../entities/npc.entity';
import { createActionableDefinition } from '../definitions/actionable.definition';

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
        if (interactive instanceof NpcEntity) {
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

              const { result: dodgeResult } = this.rollRule.actorSkillCheck(
                this.characterService.currentCharacter,
                'Dodge'
              );

              if (!dodgeable || dodgeResult === 'FAILURE') {
                const damageAmount =
                  this.rollRule.roll(damage.diceRoll) + damage.fixed;

                const log = this.characterService.currentCharacter.reactTo(
                  createActionableDefinition('ATTACK', 'attack', 'Attack'),
                  enemyResult,
                  damageAmount
                );

                if (log) {
                  logs.push(createFreeLogMessage('player', log));
                }
              } else {
                logs.push(
                  createFreeLogMessage('player', createDodgedMessage())
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

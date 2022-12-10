import { Injectable } from '@angular/core';

import { Dice } from '../definitions/dice.definition';
import { RollDefinition } from '../definitions/roll.definition';
import { skillDefinitions } from '../definitions/skill.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { DiceLiteral } from '../literals/dice.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  private readonly diceMap: {
    readonly [key in DiceLiteral]: { min: number; max: number };
  };

  public readonly competencyChecks = 5;

  public readonly competencyPasses = 3;

  constructor(private readonly rngService: RandomIntService) {
    this.diceMap = {
      D4: { min: 1, max: 4 },
      D6: { min: 1, max: 6 },
      D8: { min: 1, max: 8 },
      D10: { min: 1, max: 10 },
      D12: { min: 1, max: 12 },
      D20: { min: 1, max: 20 },
      D100: { min: 1, max: 100 },
    };
  }

  public actorSkillCheck(
    actor: ActorInterface,
    skillName: SkillNameLiteral
  ): RollDefinition {
    const skillValue = actor.skills[skillName] ?? 0;

    if (skillValue === 0) {
      return new RollDefinition('IMPOSSIBLE', 0);
    }

    const isCombatSkill = skillDefinitions[skillName].combat;

    if (isCombatSkill) {
      return this.skillCheck(skillValue);
    }

    return this.competencyCheck(skillValue);
  }

  public roll(roll: Dice): number {
    let acc = 0;

    for (const key in roll) {
      if (Object.prototype.hasOwnProperty.call(roll, key)) {
        const dice = key as DiceLiteral;

        const amount = roll[dice];

        for (let index = 0; index < amount; index++) {
          const { min, max } = this.diceMap[dice];

          acc += this.rngService.getRandomInterval(min, max);
        }
      }
    }

    return acc;
  }

  private skillCheck(skillValue: number): RollDefinition {
    const rolled = this.rngService.getRandomInterval(1, 100);

    const result = rolled <= skillValue ? 'SUCCESS' : 'FAILURE';

    return new RollDefinition(result, rolled);
  }

  private competencyCheck(skillValue: number): RollDefinition {
    const rolled: number[] = [];

    for (let index = 0; index < this.competencyChecks; index++) {
      rolled.push(this.rngService.getRandomInterval(1, 100));
    }

    rolled.sort((a, b) => a - b);

    const selected = rolled.slice(0, this.competencyPasses);

    const worstRollSelected = selected[selected.length - 1];

    const result = worstRollSelected <= skillValue ? 'SUCCESS' : 'FAILURE';

    return new RollDefinition(result, worstRollSelected);
  }
}

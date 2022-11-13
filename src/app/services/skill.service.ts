import { Injectable } from '@angular/core';

import { ArrayView } from '../definitions/array-view.definition';
import { CharacterSkills } from '../definitions/character-skills.definition';
import { commonSkillDefinitions } from '../definitions/skill.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private readonly randomIntService: RandomIntService) {}

  public newSkillSetFor(
    skillNames: ArrayView<SkillNameLiteral>
  ): CharacterSkills {
    return skillNames.keyValues.reduce(
      (acc: { [key: string]: number }, skillName) => {
        acc[skillName] = 0;

        return acc;
      },
      {}
    );
  }

  public distribute(
    characterSkills: CharacterSkills,
    points: number
  ): CharacterSkills {
    let spent = 0;

    const distributedSkills: { [key: string]: number } = {};

    Object.assign(distributedSkills, characterSkills);

    while (spent < points) {
      for (const key in distributedSkills) {
        if (Object.prototype.hasOwnProperty.call(distributedSkills, key)) {
          if (spent >= points) {
            break;
          }

          const roll = this.randomIntService.getRandomInterval(0, 1);

          if (roll) {
            distributedSkills[key] += 5;

            spent += 5;
          }
        }
      }
    }

    return distributedSkills;
  }
}

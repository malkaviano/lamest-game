import { Injectable } from '@angular/core';

import { ArrayView } from '../views/array.view';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private readonly randomIntService: RandomIntService) {}

  public newSkillSetFor(
    skillNames: ArrayView<SkillNameLiteral>
  ): Map<SkillNameLiteral, number> {
    let skills = new Map<SkillNameLiteral, number>();

    return skillNames.items.reduce((acc, skillName) => {
      acc.set(skillName, 0);

      return acc;
    }, skills);
  }

  public distribute(
    characterSkills: Map<SkillNameLiteral, number>,
    points: number
  ): Map<SkillNameLiteral, number> {
    let spent = 0;

    while (spent < points) {
      characterSkills.forEach((v, k, m) => {
        if (spent < points) {
          const roll = this.randomIntService.getRandomInterval(0, 1);

          if (roll) {
            characterSkills.set(k, v + 5);

            spent += 5;
          }
        }
      });
    }

    return characterSkills;
  }
}

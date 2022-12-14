import { Injectable } from '@angular/core';

import { ArrayView } from '../views/array.view';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private readonly randomIntService: RandomIntService) {}

  public newSkillSetFor(skillNames: ArrayView<string>): Map<string, number> {
    const skills = new Map<string, number>();

    return skillNames.items.reduce((acc, skillName) => {
      acc.set(skillName, 0);

      return acc;
    }, skills);
  }

  public distribute(
    characterSkills: Map<string, number>,
    points: number
  ): Map<string, number> {
    let spent = 0;

    while (spent < points) {
      characterSkills.forEach((v, k) => {
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

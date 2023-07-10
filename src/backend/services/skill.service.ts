import { ArrayView } from '@conceptual/view-models/array.view';
import { RandomIntHelper } from '@conceptual/helpers/random-int.helper';

export class SkillService {
  constructor(private readonly rngHelper: RandomIntHelper) {}

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
          const roll = this.rngHelper.getRandomInterval(0, 1);

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

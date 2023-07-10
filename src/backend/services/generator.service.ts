import { uniqueNamesGenerator, names } from 'unique-names-generator';

import { CharacterIdentityDefinition } from '@definitions/character-identity.definition';
import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { AgeLiteral, ages } from '@conceptual/literals/age.literal';
import { HeightLiteral, heights } from '@conceptual/literals/height.literal';
import { RaceLiteral, races } from '@conceptual/literals/race.literal';
import { WeightLiteral, weights } from '@conceptual/literals/weight.literal';
import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { ProfessionStore } from '../../stores/profession.store';
import { RandomIntHelper } from '@conceptual/helpers/random-int.helper';

export class GeneratorService {
  constructor(
    private readonly randomIntHelper: RandomIntHelper,
    private readonly professionStore: ProfessionStore
  ) {}

  public characteristics(): CharacteristicSetDefinition {
    return {
      STR: new CharacteristicDefinition('STR', this.twoD6Plus6()),
      VIT: new CharacteristicDefinition('VIT', this.twoD6Plus6()),
      AGI: new CharacteristicDefinition('AGI', this.twoD6Plus6()),
      INT: new CharacteristicDefinition('INT', this.twoD6Plus6()),
      ESN: new CharacteristicDefinition('ESN', this.twoD6Plus6()),
      APP: new CharacteristicDefinition('APP', this.twoD6Plus6()),
    };
  }

  public identity(): CharacterIdentityDefinition {
    return new CharacterIdentityDefinition(
      this.name(),
      this.profession(),
      this.age(),
      this.race(),
      this.height(),
      this.weight(),
      'VISIBLE'
    );
  }

  private height(): HeightLiteral {
    const index = this.randomIntHelper.getRandomInterval(0, heights.length - 1);

    return heights[index];
  }

  private weight(): WeightLiteral {
    const index = this.randomIntHelper.getRandomInterval(0, weights.length - 1);

    return weights[index];
  }

  private age(): AgeLiteral {
    const index = this.randomIntHelper.getRandomInterval(0, ages.length - 1);

    return ages[index];
  }

  private race(): RaceLiteral {
    const index = this.randomIntHelper.getRandomInterval(0, races.length - 1);

    return races[index];
  }

  private profession(): string {
    const keys = Object.keys(this.professionStore.professions);

    const index = this.randomIntHelper.getRandomInterval(0, keys.length - 1);

    return keys[index];
  }

  private name(): string {
    return uniqueNamesGenerator({
      dictionaries: [names, names],
      separator: ' ',
      length: 2,
    });
  }

  private twoD6Plus6(): number {
    const roll1 = this.randomIntHelper.getRandomInterval(1, 6);
    const roll2 = this.randomIntHelper.getRandomInterval(1, 6);

    return 6 + roll1 + roll2;
  }
}

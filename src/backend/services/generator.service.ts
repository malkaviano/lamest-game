import { Injectable } from '@angular/core';

import { uniqueNamesGenerator, names } from 'unique-names-generator';

import { CharacterIdentityDefinition } from '../../core/definitions/character-identity.definition';
import { CharacteristicDefinition } from '../../core/definitions/characteristic.definition';
import { AgeLiteral, ages } from '../../core/literals/age.literal';
import { HeightLiteral, heights } from '../../core/literals/height.literal';
import { RaceLiteral, races } from '../../core/literals/race.literal';
import { WeightLiteral, weights } from '../../core/literals/weight.literal';
import { RandomIntService } from './random-int.service';
import { CharacteristicSetDefinition } from '../../core/definitions/characteristic-set.definition';
import { DirectionLiteral } from '../../core/literals/direction.literal';
import { ProfessionStore } from '../stores/profession.store';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(
    private readonly randomIntService: RandomIntService,
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

  public lockPickSequence(complexity: number): DirectionLiteral[] {
    const odd: DirectionLiteral[] = ['LEFT', 'RIGHT'];
    const even: DirectionLiteral[] = ['DOWN', 'UP'];

    const sequence: DirectionLiteral[] = [];

    for (let index = 1; index <= complexity; index++) {
      const roll = this.randomIntService.getRandomInterval(0, 1);

      const result = index % 2 ? odd[roll] : even[roll];

      sequence.push(result);
    }

    return sequence;
  }

  private height(): HeightLiteral {
    const index = this.randomIntService.getRandomInterval(
      0,
      heights.length - 1
    );

    return heights[index];
  }

  private weight(): WeightLiteral {
    const index = this.randomIntService.getRandomInterval(
      0,
      weights.length - 1
    );

    return weights[index];
  }

  private age(): AgeLiteral {
    const index = this.randomIntService.getRandomInterval(0, ages.length - 1);

    return ages[index];
  }

  private race(): RaceLiteral {
    const index = this.randomIntService.getRandomInterval(0, races.length - 1);

    return races[index];
  }

  private profession(): string {
    const keys = Object.keys(this.professionStore.professions);

    const index = this.randomIntService.getRandomInterval(0, keys.length - 1);

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
    const roll1 = this.randomIntService.getRandomInterval(1, 6);
    const roll2 = this.randomIntService.getRandomInterval(1, 6);

    return 6 + roll1 + roll2;
  }
}

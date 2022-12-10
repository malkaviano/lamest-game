import { Injectable } from '@angular/core';

import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { professions } from '../definitions/profession.definition';
import { AgeLiteral, ages } from '../literals/age.literal';
import { HeightLiteral, heights } from '../literals/height.literal';
import { ProfessionLiteral } from '../literals/profession.literal';
import { RaceLiteral, races } from '../literals/race.literal';
import { WeightLiteral, weights } from '../literals/weight.literal';
import { RandomIntService } from './random-int.service';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(private readonly randomIntService: RandomIntService) {}

  public characteristics(): CharacteristicSetDefinition {
    return {
      STR: new CharacteristicDefinition('STR', this.twoD6Plus6()),
      CON: new CharacteristicDefinition('CON', this.twoD6Plus6()),
      SIZ: new CharacteristicDefinition('SIZ', this.twoD6Plus6()),
      DEX: new CharacteristicDefinition('DEX', this.twoD6Plus6()),
      INT: new CharacteristicDefinition('INT', this.twoD6Plus6()),
      POW: new CharacteristicDefinition('POW', this.twoD6Plus6()),
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
      this.weight()
    );
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

  private profession(): ProfessionLiteral {
    const index = this.randomIntService.getRandomInterval(
      0,
      professions.items.length - 1
    );

    return professions.items[index];
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

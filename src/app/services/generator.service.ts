import { Injectable } from '@angular/core';

import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { professions } from '../definitions/profession.definition';

import { AgeLiteral, ages } from '../literals/age.literal';
import { GenderLiteral, genders } from '../literals/gender.literal';
import { HeightLiteral, heights } from '../literals/height.literal';
import { ProfessionLiteral } from '../literals/profession.literal';
import { RaceLiteral, races } from '../literals/race.literal';
import { WeightLiteral, weights } from '../literals/weight.literal';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(private readonly randomIntService: RandomIntService) {}

  public characteristics(): CharacteristicsDefinition {
    return new CharacteristicsDefinition(
      new CharacteristicDefinition('STR', this.twoD6Plus6()),
      new CharacteristicDefinition('CON', this.twoD6Plus6()),
      new CharacteristicDefinition('SIZ', this.twoD6Plus6()),
      new CharacteristicDefinition('DEX', this.twoD6Plus6()),
      new CharacteristicDefinition('INT', this.twoD6Plus6()),
      new CharacteristicDefinition('POW', this.twoD6Plus6()),
      new CharacteristicDefinition('APP', this.twoD6Plus6())
    );
  }

  public identity(): IdentityDefinition {
    return new IdentityDefinition(
      this.name(),
      this.profession(),
      this.gender(),
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

  private gender(): GenderLiteral {
    const index = this.randomIntService.getRandomInterval(
      0,
      genders.length - 1
    );

    return genders[index];
  }

  private race(): RaceLiteral {
    const index = this.randomIntService.getRandomInterval(0, races.length - 1);

    return races[index];
  }

  private profession(): ProfessionLiteral {
    const index = this.randomIntService.getRandomInterval(
      0,
      professions.keyValues.length - 1
    );

    return professions.keyValues[index];
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

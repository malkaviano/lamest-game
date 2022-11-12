import { Injectable } from '@angular/core';

import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { CharacterIdentity } from '../definitions/character-identity.definition';
import { Characteristic } from '../definitions/characteristic.definition';
import { Characteristics } from '../definitions/characteristics.definition';
import { IdentityFeature } from '../definitions/identity-feature.definition';

import { AgeLiteral, ages } from '../literals/age.literal';
import { GenderLiteral, genders } from '../literals/gender.literal';
import { HeightLiteral, heights } from '../literals/height.literal';
import { ProfessionLiteral, professions } from '../literals/profession.literal';
import { RaceLiteral, races } from '../literals/race.literal';
import { WeightLiteral, weights } from '../literals/weight.literal';
import { RandomIntService } from './random-int.service';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(private readonly randomIntService: RandomIntService) {}

  public characteristics(): Characteristics {
    return new Characteristics(
      new Characteristic(
        'STR',
        this.twoD6Plus6(),
        'The character physical force'
      ),
      new Characteristic(
        'CON',
        this.twoD6Plus6(),
        'The character body constitution'
      ),
      new Characteristic('SIZ', this.twoD6Plus6(), 'The character body shape'),
      new Characteristic('DEX', this.twoD6Plus6(), 'The character agility'),
      new Characteristic(
        'INT',
        this.twoD6Plus6(),
        'The character intelligence'
      ),
      new Characteristic(
        'POW',
        this.twoD6Plus6(),
        'The character mental strength'
      ),
      new Characteristic('APP', this.twoD6Plus6(), 'The character looks')
    );
  }

  public identity(): CharacterIdentity {
    return new CharacterIdentity(
      new IdentityFeature('NAME', this.name(), 'Character name'),
      new IdentityFeature(
        'PROFESSION',
        this.profession(),
        'Character profession'
      ),
      new IdentityFeature('GENDER', this.gender(), 'Character gender'),
      new IdentityFeature('AGE', this.age(), 'Character age'),
      new IdentityFeature('RACE', this.race(), 'Character race'),
      new IdentityFeature('HEIGHT', this.height(), 'Character height'),
      new IdentityFeature('WEIGHT', this.weight(), 'Character weight')
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
      professions.length - 1
    );

    return professions[index];
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

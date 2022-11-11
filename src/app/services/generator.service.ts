import { Injectable } from '@angular/core';

import { uniqueNamesGenerator, names } from 'unique-names-generator';

import { KeyValue } from '../definitions/key-value.definition';
import { AgeLiteral, ages } from '../literals/age.literal';
import { GenderLiteral, genders } from '../literals/gender.literal';
import { HeightLiteral, heights } from '../literals/height.literal';
import { ProfessionLiteral, professions } from '../literals/profession.literal';
import { RaceLiteral, races } from '../literals/race.literal';
import { WeightLiteral, weights } from '../literals/weight.literal';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  public characteristics(): KeyValue[] {
    return [
      new KeyValue(
        'STR',
        `${this.twoD6Plus6()}`,
        'The character physical force'
      ),
      new KeyValue(
        'CON',
        `${this.twoD6Plus6()}`,
        'The character body constitution'
      ),
      new KeyValue('SIZ', `${this.twoD6Plus6()}`, 'The character body shape'),
      new KeyValue('DEX', `${this.twoD6Plus6()}`, 'The character agility'),
      new KeyValue('INT', `${this.twoD6Plus6()}`, 'The character intelligence'),
      new KeyValue(
        'POW',
        `${this.twoD6Plus6()}`,
        'The character mental strength'
      ),
      new KeyValue('APP', `${this.twoD6Plus6()}`, 'The character looks'),
    ];
  }

  public height(): HeightLiteral {
    const index = this.getRandomIntInclusive(0, heights.length - 1);

    return heights[index];
  }

  public weight(): WeightLiteral {
    const index = this.getRandomIntInclusive(0, weights.length - 1);

    return weights[index];
  }

  public age(): AgeLiteral {
    const index = this.getRandomIntInclusive(0, ages.length - 1);

    return ages[index];
  }

  public gender(): GenderLiteral {
    const index = this.getRandomIntInclusive(0, genders.length - 1);

    return genders[index];
  }

  public race(): RaceLiteral {
    const index = this.getRandomIntInclusive(0, races.length - 1);

    return races[index];
  }

  public profession(): ProfessionLiteral {
    const index = this.getRandomIntInclusive(0, professions.length - 1);

    return professions[index];
  }

  public name(): string {
    return uniqueNamesGenerator({
      dictionaries: [names, names],
      separator: ' ',
      length: 2,
    });
  }

  private twoD6Plus6(): number {
    return (
      this.getRandomIntInclusive(1, 6) + this.getRandomIntInclusive(1, 6) + 6
    );
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  private getRandomIntInclusive(min: number, max: number) {
    min = Math.trunc(min);
    max = Math.floor(max);
    return Math.trunc(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
}

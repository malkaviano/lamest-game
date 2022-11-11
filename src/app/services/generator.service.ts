import { Injectable } from '@angular/core';

import { Characteristic } from '../definitions/characteristic.definition';

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  public characteristics(): Characteristic[] {
    return [
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
      new Characteristic('APP', this.twoD6Plus6(), 'The character looks'),
    ];
  }

  private twoD6Plus6(): number {
    return (
      this.getRandomIntInclusive(1, 6) + this.getRandomIntInclusive(1, 6) + 6
    );
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  private getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
}

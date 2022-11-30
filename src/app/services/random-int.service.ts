import { Injectable } from '@angular/core';

import { createDice, Dice } from '../definitions/dice.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { RollDefinition } from '../definitions/roll.definition';
import { DiceLiteral } from '../literals/dice.literal';

@Injectable({
  providedIn: 'root',
})
export class RandomIntService {
  private readonly diceMap: {
    readonly [key in DiceLiteral]: { min: number; max: number };
  };

  constructor() {
    this.diceMap = {
      D4: { min: 1, max: 4 },
      D6: { min: 1, max: 6 },
      D8: { min: 1, max: 8 },
      D10: { min: 1, max: 10 },
      D12: { min: 1, max: 12 },
      D20: { min: 1, max: 20 },
      D100: { min: 1, max: 100 },
    };
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  public getRandomInterval(min: number, max: number): number {
    min = Math.trunc(min);
    max = Math.floor(max);
    return Math.trunc(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  public roll(roll: Dice): number {
    let acc = 0;

    for (const key in roll) {
      if (Object.prototype.hasOwnProperty.call(roll, key)) {
        const dice = key as DiceLiteral;

        const amount = roll[dice];

        for (let index = 0; index < amount; index++) {
          const { min, max } = this.diceMap[dice];

          acc += this.getRandomInterval(min, max);
        }
      }
    }

    return acc;
  }

  public checkSkill(skillValue: number): RollDefinition {
    if (skillValue <= 0) {
      throw new Error(errorMessages['SHOULD-NOT-HAPPEN']);
    }

    const roll = this.roll(createDice({ D100: 1 }));

    const result = roll <= skillValue ? 'SUCCESS' : 'FAILURE';

    return new RollDefinition(result, roll);
  }
}

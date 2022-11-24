import { Dice } from './dice.definition';

export class DamageDefinition {
  constructor(public readonly diceRoll: Dice, public readonly fixed: number) {}
}

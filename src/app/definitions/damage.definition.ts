import { DiceRoll } from './dice-roll.definition';

export class DamageDefinition {
  constructor(
    public readonly diceRoll: DiceRoll,
    public readonly fixed: number
  ) {}
}

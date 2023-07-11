import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { Dice } from '@definitions/dice.definition';

export class EffectDefinition {
  constructor(
    public readonly diceRoll: Dice,
    public readonly fixed: number,
    public readonly effectType: EffectTypeLiteral
  ) {}
}

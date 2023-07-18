import { Dice } from '@definitions/dice.definition';
import { EffectTypeLiteral } from '@literals/effect-type.literal';

export class EffectDefinition {
  constructor(
    public readonly diceRoll: Dice,
    public readonly fixed: number,
    public readonly effectType: EffectTypeLiteral
  ) {}
}

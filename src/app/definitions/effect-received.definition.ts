import { EffectTypeLiteral } from '../literals/effect-type.literal';

export class EffectReceivedDefinition {
  constructor(
    public readonly effectType: EffectTypeLiteral,
    public readonly amount: number
  ) {}
}

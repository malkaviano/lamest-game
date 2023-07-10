import { EffectTypeLiteral } from '@literals/effect-type.literal';

export class EffectEvent {
  constructor(
    public readonly effectType: EffectTypeLiteral,
    public readonly amount: number
  ) {}
}

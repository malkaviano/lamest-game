import { EffectTypeLiteral } from '@literals/effect-type.literal';

export interface ActorDefenseInterface {
  wannaDodge(effect: EffectTypeLiteral): boolean;
}

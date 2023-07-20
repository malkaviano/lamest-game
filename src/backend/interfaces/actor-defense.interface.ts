import { EffectTypeLiteral } from '@literals/effect-type.literal';

export interface ActorDefenseInterface {
  set dodge(enabled: boolean);

  wannaDodge(effect: EffectTypeLiteral): boolean;
}

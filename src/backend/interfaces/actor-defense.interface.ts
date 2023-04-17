import { EffectTypeLiteral } from '../literals/effect-type.literal';

export interface ActorDefenseInterface {
  get dodgesPerRound(): number;

  wannaDodge(effect: EffectTypeLiteral): boolean;
}

import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { ArrayView } from '../model-views/array.view';

export interface ActorSettingsInterface {
  readonly vulnerabilityCoefficient: number;
  readonly resistanceCoefficient: number;
  readonly effectDefenses: {
    readonly immunities: ArrayView<EffectTypeLiteral>;
    readonly cures: ArrayView<EffectTypeLiteral>;
    readonly vulnerabilities: ArrayView<EffectTypeLiteral>;
    readonly resistances: ArrayView<EffectTypeLiteral>;
  };
  readonly oneDodgesEveryAgiAmount: number;
}

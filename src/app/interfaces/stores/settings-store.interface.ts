import { EffectTypeLiteral } from '../../literals/effect-type.literal';
import { ArrayView } from '../../model-views/array.view';

export interface SettingsStoreInterface {
  readonly settings: {
    readonly professionPoints: number;
    readonly intelligencePoints: number;
    readonly vulnerabilityCoefficient: number;
    readonly resistanceCoefficient: number;
    readonly playerEffectDefenses: {
      readonly immunities: ArrayView<EffectTypeLiteral>;
      readonly cures: ArrayView<EffectTypeLiteral>;
      readonly vulnerabilities: ArrayView<EffectTypeLiteral>;
      readonly resistances: ArrayView<EffectTypeLiteral>;
    };
    readonly oneDodgesEveryAgiAmount: number;
    readonly actionCooldown: number;
  };
}

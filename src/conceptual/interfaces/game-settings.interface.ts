import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { RuleNameLiteral } from '../literals/rule-name.literal';
import { ArrayView } from '../view-models/array.view';

export interface GameSettingsInterface {
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
  readonly oneDodgeEveryAgiAmount: number;
  readonly apRegeneration: {
    readonly intervalMilliseconds: number;
    readonly amount: number;
  };
  readonly ruleCost: { [key in RuleNameLiteral]: number };
  readonly aiLoopMilliseconds: number;
}

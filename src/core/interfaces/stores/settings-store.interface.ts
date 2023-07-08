import { EffectTypeLiteral } from '../../literals/effect-type.literal';
import { RuleNameLiteral } from '../../literals/rule-name.literal';

export interface SettingsStoreInterface {
  readonly settings: {
    readonly professionPoints: number;
    readonly intelligencePoints: number;
    readonly vulnerabilityCoefficient: number;
    readonly resistanceCoefficient: number;
    readonly playerEffectDefenses: {
      readonly immunities: EffectTypeLiteral[];
      readonly cures: EffectTypeLiteral[];
      readonly vulnerabilities: EffectTypeLiteral[];
      readonly resistances: EffectTypeLiteral[];
    };
    readonly oneDodgeEveryAgiAmount: number;
    readonly actionCooldown: number;
    readonly ruleCost: { [key in RuleNameLiteral]: number };
  };
}

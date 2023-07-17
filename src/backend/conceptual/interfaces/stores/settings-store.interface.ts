import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';

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
    readonly ruleCost: { [key in RuleNameLiteral]: number };
    readonly aiLoopMilliseconds: number;
    readonly actionPoints: {
      readonly oneEveryAgility: number;
      readonly base: number;
      readonly regeneration: {
        readonly intervalMilliseconds: number;
        readonly amount: number;
      };
    };
    readonly weaponQuality: {
      readonly INFERIOR: number;
      readonly COMMON: number;
      readonly SUPERIOR: number;
      readonly SUPERB: number;
    };
    readonly armorPenalty: {
      readonly MINIMAL: {
        readonly Dodge: number;
        readonly AGI: number;
      };
      readonly LIGHT: {
        readonly Dodge: number;
        readonly AGI: number;
      };
      readonly MEDIUM: {
        readonly Dodge: number;
        readonly AGI: number;
      };
      readonly HEAVY: {
        readonly Dodge: number;
        readonly AGI: number;
      };
    };
  };
}

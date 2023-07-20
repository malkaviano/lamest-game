import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { ArrayView } from '@wrappers/array.view';
import { Dice } from '@definitions/dice.definition';
import { ArmorPenaltyLiteral } from '@literals/armor-penalty.literal';

export type GameSettingsValues = {
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
  readonly dodgeAPCost: number;
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
      readonly DodgeSkill: number;
      readonly AGI: number;
    };
    readonly LIGHT: {
      readonly DodgeSkill: number;
      readonly AGI: number;
    };
    readonly MEDIUM: {
      readonly DodgeSkill: number;
      readonly AGI: number;
    };
    readonly HEAVY: {
      readonly DodgeSkill: number;
      readonly AGI: number;
    };
  };
  readonly systemSkills: {
    readonly dodgeSkill: string;
    readonly disguiseSkill: string;
    readonly stealthSkill: string;
  };
  readonly unarmedDamage: {
    readonly dice: Partial<Dice>;
    readonly fixed: number;
    readonly effect: EffectTypeLiteral;
  };
  readonly clothArmor: {
    readonly reduction: {
      KINETIC?: number;
      PROFANE?: number;
      SACRED?: number;
      REMEDY?: number;
      ACID?: number;
      FIRE?: number;
    };
    readonly penalty: ArmorPenaltyLiteral;
  };
};

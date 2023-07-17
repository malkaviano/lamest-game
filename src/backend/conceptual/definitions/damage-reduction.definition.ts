import { EffectTypeLiteral } from '@literals/effect-type.literal';

export type DamageReductionDefinition = {
  readonly [key in EffectTypeLiteral]: number;
};

export const createDamageReduction = (
  damageReduction: {
    KINETIC?: number;
    PROFANE?: number;
    SACRED?: number;
    REMEDY?: number;
    ACID?: number;
    FIRE?: number;
  } = {}
) => {
  return {
    KINETIC: damageReduction['KINETIC'] ?? 0,
    PROFANE: damageReduction['PROFANE'] ?? 0,
    SACRED: damageReduction['SACRED'] ?? 0,
    REMEDY: damageReduction['REMEDY'] ?? 0,
    ACID: damageReduction['ACID'] ?? 0,
    FIRE: damageReduction['FIRE'] ?? 0,
  };
};

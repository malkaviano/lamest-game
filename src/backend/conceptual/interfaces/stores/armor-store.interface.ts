import { ArmorPenaltyLiteral } from '@literals/armor-penalty.literal';

export interface ArmorStoreInterface {
  readonly armor: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly damageReduction: {
      readonly KINETIC: number;
      readonly PROFANE: number;
      readonly SACRED: number;
      readonly ACID: number;
      readonly FIRE: number;
    };
    readonly armorPenalty: ArmorPenaltyLiteral;
  }[];
}

import { Dice } from '../definitions/dice.definition';

import { WeaponUsabilityLiteral } from '../literals/weapon-usability';

export interface WeaponStoreInterface {
  readonly weapons: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly skillName: string;
    readonly damage: {
      readonly dice: Dice;
      readonly fixed: number;
    };
    readonly dodgeable: boolean;
    readonly usability: WeaponUsabilityLiteral;
  }[];
}

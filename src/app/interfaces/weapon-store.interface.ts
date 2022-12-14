import { Dice } from '../definitions/dice.definition';
import { WeaponCaliberLiteral } from '../literals/weapon-caliber.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { WeaponUsabilityLiteral } from '../literals/weapon-usability';
import { ReloadMechanismLiteral } from '../literals/reload-mechanism.literal';

export interface WeaponStoreInterface {
  readonly weapons: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly skillName: SkillNameLiteral;
    readonly damage: {
      readonly dice: Dice;
      readonly fixed: number;
    };
    readonly dodgeable: boolean;
    readonly usability: WeaponUsabilityLiteral;
    readonly munition?: {
      caliber: WeaponCaliberLiteral;
      reload: ReloadMechanismLiteral;
    };
  }[];
}

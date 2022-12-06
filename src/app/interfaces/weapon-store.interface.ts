import { Dice } from '../definitions/dice.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { WeaponUsabilityLiteral } from '../literals/weapon-usability';

export interface WeaponStoreInterface {
  readonly weapons: {
    name: string;
    label: string;
    description: string;
    skillName: SkillNameLiteral;
    damage: {
      dice: Dice;
      fixed: number;
    };
    dodgeable: boolean;
    usability: WeaponUsabilityLiteral;
  }[];
}

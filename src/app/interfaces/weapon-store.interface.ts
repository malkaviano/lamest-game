import { Dice } from '../definitions/dice.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';

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
  }[];
}

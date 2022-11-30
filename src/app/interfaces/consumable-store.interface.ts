import { SkillNameLiteral } from '../literals/skill-name.literal';

export interface ConsumableStoreInterface {
  readonly consumables: {
    name: string;
    label: string;
    description: string;
    hp: number;
    skillName?: SkillNameLiteral;
  }[];
}

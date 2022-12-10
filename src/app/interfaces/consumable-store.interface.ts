import { SkillNameLiteral } from '../literals/skill-name.literal';

export interface ConsumableStoreInterface {
  readonly consumables: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly hp: number;
    readonly skillName?: SkillNameLiteral;
  }[];
}

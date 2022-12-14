import { SkillNameLiteral } from '../../literals/skill-name.literal';

export interface ProfessionStoreInterface {
  readonly professions: {
    readonly name: string;
    readonly skills: SkillNameLiteral[];
  }[];
}

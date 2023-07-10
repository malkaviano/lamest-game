import { SkillAffinityLiteral } from '@literals/skill-category.literal';

export interface SkillStoreInterface {
  readonly skills: {
    readonly name: string;
    readonly description: string;
    readonly affinity: SkillAffinityLiteral;
    readonly combat: boolean;
    readonly influenced: string[];
  }[];
}

import { SkillAffinityLiteral } from '@literals/skill-category.literal';
import { CharacteristicNameLiteral } from '@literals/characteristic-name.literal';

export class SkillDefinition {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly affinity: SkillAffinityLiteral,
    public readonly combat: boolean,
    public readonly influenced: CharacteristicNameLiteral[]
  ) {}
}

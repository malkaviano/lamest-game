import { CharacteristicSetDefinition } from './characteristic-set.definition';
import { SkillAffinityLiteral } from '@literals/skill-category.literal';

export class SkillDefinition {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly affinity: SkillAffinityLiteral,
    public readonly combat: boolean,
    private readonly baseGenerator: (
      characteristics: CharacteristicSetDefinition
    ) => number
  ) {}

  public base(characteristics: CharacteristicSetDefinition): number {
    return this.baseGenerator(characteristics);
  }
}

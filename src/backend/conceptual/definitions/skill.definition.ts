import { CharacteristicValues } from '@values/characteristic.value';
import { SkillAffinityLiteral } from '@literals/skill-category.literal';

export class SkillDefinition {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly affinity: SkillAffinityLiteral,
    public readonly combat: boolean,
    private readonly baseGenerator: (
      characteristics: CharacteristicValues
    ) => number
  ) {}

  public base(characteristics: CharacteristicValues): number {
    return this.baseGenerator(characteristics);
  }
}

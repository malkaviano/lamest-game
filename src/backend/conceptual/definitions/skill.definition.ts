import { SkillAffinityLiteral } from '@literals/skill-category.literal';
import { CharacteristicValues } from '@values/characteristic.value';

export class SkillDefinition {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly affinity: SkillAffinityLiteral,
    public readonly combat: boolean,
    // TODO: Remove this
    private readonly baseGenerator: (
      characteristics: CharacteristicValues
    ) => number
  ) {}

  public base(characteristics: CharacteristicValues): number {
    return this.baseGenerator(characteristics);
  }
}

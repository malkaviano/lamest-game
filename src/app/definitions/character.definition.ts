import { DerivedAttributesDefinition } from './attributes.definition';
import { CharacterIdentityDefinition } from './character-identity.definition';
import { CharacteristicsDefinition } from './characteristics.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { skillDefinitions } from './skill.definition';

export class CharacterDefinition {
  constructor(
    public readonly identity: CharacterIdentityDefinition,
    public readonly characteristics: CharacteristicsDefinition,
    public readonly derivedAttributes: DerivedAttributesDefinition,
    private readonly mSkills: Map<SkillNameLiteral, number>
  ) {}

  public get skills(): KeyValueInterface {
    return Array.from(this.mSkills.entries()).reduce((acc: any, [k, v]) => {
      const base = skillDefinitions[k].base(this.characteristics);

      acc[k] = v + base;

      return acc;
    }, {});
  }
}

import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { skillDefinitions } from '../definitions/skill.definition';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';

export class CharacterEntity {
  constructor(
    public readonly identity: CharacterIdentityDefinition,
    public readonly characteristics: CharacteristicsDefinition,
    private readonly mSkills: Map<SkillNameLiteral, number>
  ) {}

  public get derivedAttributes(): DerivedAttributesDefinition {
    const hp = Math.trunc(
      (this.characteristics.con.value + this.characteristics.siz.value) / 2
    );

    const pp = this.characteristics.pow.value;

    return new DerivedAttributesDefinition(
      new DerivedAttributeDefinition('HP', hp),
      new DerivedAttributeDefinition('PP', pp),
      new DerivedAttributeDefinition('MOV', 10)
    );
  }

  public get skills(): KeyValueInterface<number> {
    return Array.from(this.mSkills.entries()).reduce((acc: any, [k, v]) => {
      const base = skillDefinitions[k].base(this.characteristics);

      acc[k] = v + base;

      return acc;
    }, {});
  }
}

import { Injectable } from '@angular/core';

import { GeneratorService } from './generator.service';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { SkillService } from './skill.service';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { professionSkillDefinitions } from '../definitions/profession.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import {
  commonSkillDefinitions,
  skillDefinitions,
} from '../definitions/skill.definition';
import { CharacterDefinition } from '../definitions/character.definition';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService
  ) {}

  public character(): CharacterDefinition {
    return new CharacterDefinition(
      this.identity(),
      this.characteristics(),
      this.attributes(this.characteristics()),
      this.skills(this.identity(), this.characteristics())
    );
  }

  private identity(): CharacterIdentityDefinition {
    return this.generator.identity();
  }

  private characteristics(): CharacteristicsDefinition {
    return this.generator.characteristics();
  }

  private attributes(
    characteristics: CharacteristicsDefinition
  ): DerivedAttributesDefinition {
    const hp = Math.trunc(
      (characteristics.con.value + characteristics.siz.value) / 2
    );

    const pp = characteristics.pow.value;

    return new DerivedAttributesDefinition(
      new DerivedAttributeDefinition('HP', hp),
      new DerivedAttributeDefinition('PP', pp),
      new DerivedAttributeDefinition('MOV', 10)
    );
  }

  private skills(
    identity: CharacterIdentityDefinition,
    characteristics: CharacteristicsDefinition
  ): KeyValueInterface {
    const professionSkills = professionSkillDefinitions[identity.profession];

    const distributedProfessionSkills = this.skillService.distribute(
      this.skillService.newSkillSetFor(professionSkills),
      300
    );

    const characterSkills: KeyValueInterface = {};

    Object.assign(
      characterSkills,
      this.skillService.newSkillSetFor(commonSkillDefinitions),
      distributedProfessionSkills
    );

    const distributedCharacterSkills = this.skillService.distribute(
      characterSkills,
      characteristics.int.value * 10
    );

    for (const key in distributedCharacterSkills) {
      if (
        Object.prototype.hasOwnProperty.call(distributedCharacterSkills, key)
      ) {
        const baseValue =
          skillDefinitions[key as SkillNameLiteral].base(characteristics);

        distributedCharacterSkills[key] += baseValue;
      }
    }
    return distributedCharacterSkills;
  }
}

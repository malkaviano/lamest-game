import { Injectable } from '@angular/core';

import { GeneratorService } from './generator.service';
import { Characteristics } from '../definitions/characteristics.definition';
import { DerivedAttributes } from '../definitions/attributes.definition';
import { DerivedAttribute } from '../definitions/attribute.definition';
import { CharacterIdentity } from '../definitions/character-identity.definition';
import { SkillService } from './skill.service';
import { CharacterSkills } from '../definitions/character-skills.definition';
import { professionSkillDefinitions } from '../definitions/profession.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import {
  commonSkillDefinitions,
  skillDefinitions,
} from '../definitions/skill.definition';
import { Character } from '../definitions/character.definition';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService
  ) {}

  public character(): Character {
    return new Character(
      this.identity(),
      this.characteristics(),
      this.attributes(this.characteristics()),
      this.skills(this.identity(), this.characteristics())
    );
  }

  private identity(): CharacterIdentity {
    return this.generator.identity();
  }

  private characteristics(): Characteristics {
    return this.generator.characteristics();
  }

  private attributes(characteristics: Characteristics): DerivedAttributes {
    const hp = Math.trunc(
      (characteristics.con.value + characteristics.siz.value) / 2
    );

    const pp = characteristics.pow.value;

    return new DerivedAttributes(
      new DerivedAttribute('HP', hp),
      new DerivedAttribute('PP', pp),
      new DerivedAttribute('MOV', 10)
    );
  }

  private skills(
    identity: CharacterIdentity,
    characteristics: Characteristics
  ): CharacterSkills {
    const professionSkills = professionSkillDefinitions[identity.profession];

    const distributedProfessionSkills = this.skillService.distribute(
      this.skillService.newSkillSetFor(professionSkills),
      300
    );

    const characterSkills: CharacterSkills = {};

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

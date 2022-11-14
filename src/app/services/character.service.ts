import { Injectable } from '@angular/core';

import { GeneratorService } from './generator.service';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { SkillService } from './skill.service';
import { professionSkillDefinitions } from '../definitions/profession.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { commonSkillDefinitions } from '../definitions/skill.definition';
import { CharacterDefinition } from '../definitions/character.definition';
import { ProfessionLiteral } from '../literals/profession.literal';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService
  ) {}

  public character(): CharacterDefinition {
    const identity = this.identity();
    const characteristics = this.characteristics();

    return new CharacterDefinition(
      identity,
      characteristics,
      this.attributes(characteristics),
      this.skills(identity.profession, characteristics.int.value)
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
    profession: ProfessionLiteral,
    intelligence: number
  ): Map<SkillNameLiteral, number> {
    const professionSkills = professionSkillDefinitions[profession];

    const distributedSkills = this.skillService.distribute(
      this.skillService.newSkillSetFor(professionSkills),
      300
    );

    commonSkillDefinitions.keyValues.forEach((skillName) => {
      if (!distributedSkills.has(skillName)) {
        distributedSkills.set(skillName, 0);
      }
    });

    const distributedCharacterSkills = this.skillService.distribute(
      distributedSkills,
      intelligence * 10
    );

    return distributedCharacterSkills;
  }
}

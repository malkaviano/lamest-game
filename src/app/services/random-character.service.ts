import { Injectable } from '@angular/core';

import { GeneratorService } from './generator.service';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { SkillService } from './skill.service';
import { professionSkillDefinitions } from '../definitions/profession.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { commonSkillDefinitions } from '../definitions/skill.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ProfessionLiteral } from '../literals/profession.literal';

@Injectable({
  providedIn: 'root',
})
export class RandomCharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService
  ) {}

  public character(): CharacterEntity {
    const identity = this.identity();
    const characteristics = this.characteristics();

    return new CharacterEntity(
      identity,
      characteristics,
      this.skills(identity.profession, characteristics.int.value)
    );
  }

  private identity(): CharacterIdentityDefinition {
    return this.generator.identity();
  }

  private characteristics(): CharacteristicsDefinition {
    return this.generator.characteristics();
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

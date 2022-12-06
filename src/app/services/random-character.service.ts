import { Injectable } from '@angular/core';

import { GeneratorService } from './generator.service';
import { IdentityDefinition } from '../definitions/identity.definition';
import { SkillService } from './skill.service';
import { professionSkillDefinitions } from '../definitions/profession.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { commonSkillDefinitions } from '../definitions/skill.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ProfessionLiteral } from '../literals/profession.literal';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';

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
      new ActorBehavior(
        characteristics,
        this.skills(identity.profession, characteristics['INT'].value)
      ),
      new EquipmentBehavior()
    );
  }

  private identity(): IdentityDefinition {
    return this.generator.identity();
  }

  private characteristics(): CharacteristicSetDefinition {
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

    commonSkillDefinitions.items.forEach((skillName) => {
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

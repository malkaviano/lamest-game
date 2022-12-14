import { Injectable } from '@angular/core';

import { GeneratorService } from './generator.service';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { SkillService } from './skill.service';
import { PlayerEntity } from '../entities/player.entity';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ProfessionStore } from '../stores/profession.store';
import { SkillStore } from '../stores/skill.store';

@Injectable({
  providedIn: 'root',
})
export class RandomCharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService,
    private readonly professionStore: ProfessionStore,
    private readonly skillStore: SkillStore
  ) {}

  public character(): PlayerEntity {
    const identity = this.identity();
    const characteristics = this.characteristics();

    return new PlayerEntity(
      identity,
      new ActorBehavior(
        characteristics,
        this.skills(identity.profession, characteristics['INT'].value),
        this.skillStore
      ),
      new EquipmentBehavior()
    );
  }

  private identity(): CharacterIdentityDefinition {
    return this.generator.identity();
  }

  private characteristics(): CharacteristicSetDefinition {
    return this.generator.characteristics();
  }

  private skills(
    profession: string,
    intelligence: number
  ): Map<string, number> {
    const professionSkills = this.professionStore.professions[profession];

    const distributedSkills = this.skillService.distribute(
      this.skillService.newSkillSetFor(professionSkills),
      300
    );

    this.skillStore.naturalSkills.items.forEach((skillName) => {
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

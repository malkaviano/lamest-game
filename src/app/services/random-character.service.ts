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
import { SettingsStore } from '../stores/settings.store';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class RandomCharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService,
    private readonly professionStore: ProfessionStore,
    private readonly skillStore: SkillStore,
    private readonly settingsStore: SettingsStore,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {}

  public character(): PlayerEntity {
    const identity = this.identity();
    const characteristics = this.characteristics();

    const {
      oneDodgesEveryAgiAmount,
      playerEffectDefenses,
      resistanceCoefficient,
      vulnerabilityCoefficient,
    } = this.settingsStore.settings;

    return new PlayerEntity(
      identity,
      ActorBehavior.create(
        characteristics,
        this.skills(identity.profession, characteristics.INT.value),
        this.skillStore,
        {
          effectDefenses: playerEffectDefenses,
          oneDodgesEveryAgiAmount,
          resistanceCoefficient,
          vulnerabilityCoefficient,
        }
      ),
      EquipmentBehavior.create(),
      this.stringMessagesStoreService
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
      this.settingsStore.settings.professionPoints
    );

    this.skillStore.naturalSkills.items.forEach((skillName) => {
      if (!distributedSkills.has(skillName)) {
        distributedSkills.set(skillName, 0);
      }
    });

    const distributedCharacterSkills = this.skillService.distribute(
      distributedSkills,
      intelligence * this.settingsStore.settings.intelligencePoints
    );

    return distributedCharacterSkills;
  }
}

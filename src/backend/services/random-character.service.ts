import { GeneratorService } from '@services/generator.service';
import { CharacterIdentityDefinition } from '@definitions/character-identity.definition';
import { SkillService } from '@services/skill.service';
import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { ProfessionStore } from '../../stores/profession.store';
import { SkillStore } from '../../stores/skill.store';
import { SettingsStore } from '../../stores/settings.store';
import { PlayerEntity } from '@conceptual/entities/player.entity';
import { PlayerInterface } from '@interfaces/player.interface';
import { ActorBehavior } from '@conceptual/behaviors/actor.behavior';
import { EquipmentBehavior } from '@conceptual/behaviors/equipment.behavior';
import { RegeneratorBehavior } from '@conceptual/behaviors/regenerator.behavior';

export class RandomCharacterService {
  constructor(
    private readonly generator: GeneratorService,
    private readonly skillService: SkillService,
    private readonly professionStore: ProfessionStore,
    private readonly skillStore: SkillStore
  ) {}

  public character(): PlayerInterface {
    const identity = this.identity();
    const characteristics = this.characteristics();

    return new PlayerEntity(
      identity,
      ActorBehavior.create(
        characteristics,
        this.skills(identity.profession, characteristics.INT.value),
        this.skillStore
      ),
      EquipmentBehavior.create(),
      new RegeneratorBehavior()
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
      SettingsStore.settings.professionPoints
    );

    this.skillStore.naturalSkills.items.forEach((skillName) => {
      if (!distributedSkills.has(skillName)) {
        distributedSkills.set(skillName, 0);
      }
    });

    const distributedCharacterSkills = this.skillService.distribute(
      distributedSkills,
      intelligence * SettingsStore.settings.intelligencePoints
    );

    return distributedCharacterSkills;
  }
}

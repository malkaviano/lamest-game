import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ConverterHelper } from '@helpers/converter.helper';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';
import { SkillStore } from './skill.store';
import { StatesStore } from './states.store';
import { ArrayView } from '@wrappers/array.view';
import { ActorEntity } from '@entities/actor.entity';
import { ActorBehavior } from '@behaviors/actor.behavior';
import { EquipmentBehavior } from '@behaviors/equipment.behavior';
import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';
import { AiBehavior } from '@behaviors/ai.behavior';

export class ActorStore {
  private readonly store: Map<string, ActorEntity>;

  constructor(
    stateStore: StatesStore,
    resourcesStore: ResourcesStore,
    itemStore: ItemStore,
    skillStore: SkillStore
  ) {
    this.store = new Map<string, ActorEntity>();

    resourcesStore.actorStore.actors.forEach(
      ({
        id,
        name,
        description,
        characteristics,
        skills,
        equippedWeapon,
        lootState,
        behaviorState,
        aiBehavior,
        ignores,
        visibility,
      }) => {
        const actor = new ActorEntity(
          new ActorIdentityDefinition(id, name, description, visibility),
          stateStore.states[behaviorState],
          ActorBehavior.create(characteristics, skills, skillStore),
          EquipmentBehavior.create(),
          stateStore.states[lootState],
          {
            regeneratorBehavior: new RegeneratorBehavior(),
            aiBehavior: AiBehavior.create(
              aiBehavior,
              ArrayView.fromArray(ignores)
            ),
          }
        );

        actor.equip(itemStore.items[equippedWeapon] as WeaponDefinition);

        this.store.set(id, actor);
      }
    );
  }

  public get actors(): KeyValueInterface<ActorEntity> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}

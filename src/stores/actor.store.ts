import { ActorIdentityDefinition } from '@conceptual/definitions/actor-identity.definition';
import { WeaponDefinition } from '@conceptual/definitions/weapon.definition';
import { ConverterHelper } from '@conceptual/helpers/converter.helper';
import { KeyValueInterface } from '@conceptual/interfaces/key-value.interface';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';
import { SkillStore } from './skill.store';
import { StatesStore } from './states.store';
import { ArrayView } from '@conceptual/view-models/array.view';
import { ActorEntity } from '@conceptual/entities/actor.entity';
import { ActorBehavior } from '@conceptual/behaviors/actor.behavior';
import { EquipmentBehavior } from '@conceptual/behaviors/equipment.behavior';
import { RegeneratorBehavior } from '@conceptual/behaviors/regenerator.behavior';
import { AiBehavior } from '@conceptual/behaviors/ai.behavior';

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
        resettable,
        characteristics,
        skills,
        equippedWeapon,
        killedState,
        behaviorState,
        aiBehavior,
        ignores,
        visibility,
      }) => {
        const actor = new ActorEntity(
          new ActorIdentityDefinition(id, name, description, visibility),
          stateStore.states[behaviorState],
          resettable,
          ActorBehavior.create(characteristics, skills, skillStore),
          EquipmentBehavior.create(),
          stateStore.states[killedState],
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

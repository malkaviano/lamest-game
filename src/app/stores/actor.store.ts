import { Injectable } from '@angular/core';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActorEntity } from '../entities/actor.entity';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';
import { SkillStore } from './skill.store';
import { StatesStore } from './states.store';

@Injectable({
  providedIn: 'root',
})
export class ActorStore {
  private readonly store: Map<string, ActorEntity>;

  constructor(
    private readonly converterHelper: ConverterHelper,
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
        actorSettings,
      }) => {
        const actor = new ActorEntity(
          new ActorIdentityDefinition(id, name, description),
          stateStore.states[behaviorState],
          resettable,
          ActorBehavior.create(
            characteristics,
            skills,
            skillStore,
            actorSettings
          ),
          EquipmentBehavior.create(),
          stateStore.states[killedState]
        );

        actor.equip(itemStore.items[equippedWeapon] as WeaponDefinition);

        this.store.set(id, actor);
      }
    );
  }

  public get actors(): KeyValueInterface<ActorEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

import { Injectable } from '@angular/core';
import { ActorBehavior } from '../behaviors/actor.behavior';

import { NpcEntity } from '../entities/npc.entity';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';

@Injectable({
  providedIn: 'root',
})
export class ActorStore {
  private readonly store: Map<string, NpcEntity>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    stateStore: StatesStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, NpcEntity>();

    resourcesStore.actorStore.actors.forEach(
      ({
        id,
        name,
        description,
        state,
        resettable,
        characteristics,
        skills,
      }) => {
        this.store.set(
          id,
          new NpcEntity(
            id,
            name,
            description,
            stateStore.states[state],
            resettable,
            new ActorBehavior(characteristics, skills)
          )
        );
      }
    );
  }

  public get actors(): KeyValueInterface<NpcEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

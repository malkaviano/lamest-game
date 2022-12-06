import { Injectable } from '@angular/core';

import { ActorEntity } from '../entities/actor.entity';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';

@Injectable({
  providedIn: 'root',
})
export class ActorStore {
  private readonly store: Map<string, ActorEntity>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    stateStore: StatesStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, ActorEntity>();

    resourcesStore.actorStore.actors.forEach(
      ({ id, name, description, state, resettable }) => {
        this.store.set(
          id,
          new ActorEntity(
            id,
            name,
            description,
            stateStore.states[state],
            resettable
          )
        );
      }
    );
  }

  public get actors(): KeyValueInterface<ActorEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

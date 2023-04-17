import { Injectable } from '@angular/core';

import { ConverterHelper } from '../core/helpers/converter.helper';
import { KeyValueInterface } from '../core/interfaces/key-value.interface';
import { ActorStore } from './actor.store';
import { InteractiveStore } from './interactive.store';
import { ResourcesStore } from './resources.store';
import { ArrayView } from '../core/view-models/array.view';
import { SceneEntity } from '../core/entities/scene.entity';

@Injectable({
  providedIn: 'root',
})
export class SceneStore {
  private readonly store: Map<string, SceneEntity>;

  public readonly initial: string;

  constructor(
    interactiveStore: InteractiveStore,
    actorStore: ActorStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, SceneEntity>();

    resourcesStore.sceneStore.scenes.forEach((scene) => {
      const interactives = scene.interactives.map((id) => {
        return interactiveStore.interactives[id] ?? actorStore.actors[id];
      });

      const transitions = scene.transitions.reduce(
        (obj: { [key: string]: string }, { name, scene }) => {
          obj[name] = scene;

          return obj;
        },
        {}
      );
      this.store.set(
        scene.name,
        new SceneEntity(
          scene.description,
          ArrayView.create(interactives),
          transitions,
          scene.image
        )
      );
    });

    this.initial = resourcesStore.sceneStore.initial;
  }

  public get scenes(): KeyValueInterface<SceneEntity> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}

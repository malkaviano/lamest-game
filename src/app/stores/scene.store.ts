import { Injectable } from '@angular/core';

import { SceneEntity } from '../entities/scene.entity';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../view-models/array.view';
import { ActorStore } from './actor.store';
import { DescriptionStore } from './description.store';
import { InteractiveStore } from './interactive.store';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class SceneStore {
  private readonly store: Map<string, SceneEntity>;

  public readonly initial: string;

  constructor(
    descriptionsStore: DescriptionStore,
    interactiveStore: InteractiveStore,
    actorStore: ActorStore,
    resourcesStore: ResourcesStore,
    private readonly converterHelper: ConverterHelper
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
          descriptionsStore.descriptions[scene.description],
          ArrayView.create(interactives),
          transitions,
          scene.image
        )
      );
    });

    this.initial = resourcesStore.sceneStore.initial;
  }

  public get scenes(): KeyValueInterface<SceneEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

import { Injectable } from '@angular/core';

import { SceneEntity } from '../entities/scene.entity';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../views/array.view';
import { DescriptionStore } from './description.store';
import { InteractiveStore } from './interactive.store';

import sceneStore from '../../assets/scenes.json';

@Injectable({
  providedIn: 'root',
})
export class SceneStore {
  private readonly store: Map<string, SceneEntity>;

  constructor(
    public readonly descriptionsStore: DescriptionStore,
    public readonly interactiveStore: InteractiveStore,
    private readonly converterHelper: ConverterHelper
  ) {
    this.store = new Map<string, SceneEntity>();

    sceneStore.scenes.forEach((scene) => {
      const interactives = scene.interactives.map((id) => {
        return this.interactiveStore.interactives[id];
      });

      const transitions = scene.transitions.reduce(
        (obj: any, { name, scene }) => {
          obj[name] = scene;

          return obj;
        },
        {}
      );
      this.store.set(
        scene.name,
        new SceneEntity(
          this.descriptionsStore.descriptions[scene.description],
          new ArrayView(interactives),
          transitions
        )
      );
    });
  }

  public get scenes(): KeyValueInterface<SceneEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

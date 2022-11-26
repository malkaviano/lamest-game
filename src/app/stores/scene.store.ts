import { Injectable } from '@angular/core';

import { SceneEntity } from '../entities/scene.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../views/array.view';
import { DescriptionStore } from './description.store';
import { InteractiveStore } from './interactive.store';

@Injectable({
  providedIn: 'root',
})
export class SceneStore {
  public readonly scenes: KeyValueInterface<SceneEntity>;

  constructor(
    public readonly descriptionsStore: DescriptionStore,
    public readonly interactiveStore: InteractiveStore
  ) {
    this.scenes = {
      scene1: new SceneEntity(
        this.descriptionsStore.descriptions['scene1'],
        new ArrayView([
          this.interactiveStore.interactives['npc1'],
          this.interactiveStore.interactives['sceneExitDoor'],
          this.interactiveStore.interactives['upperShelf'],
          this.interactiveStore.interactives['woodBox'],
          this.interactiveStore.interactives['corridorDoor'],
          this.interactiveStore.interactives['table'],
        ]),
        { sceneExitDoor: 'scene2', corridorDoor: 'scene3' }
      ),
      scene2: new SceneEntity(
        this.descriptionsStore.descriptions['scene2'],
        new ArrayView([
          this.interactiveStore.interactives['enterSceneDoor'],
          this.interactiveStore.interactives['trainingDummy'],
        ]),
        { enterSceneDoor: 'scene1' }
      ),
      scene3: new SceneEntity(
        this.descriptionsStore.descriptions['scene3'],
        new ArrayView([
          this.interactiveStore.interactives['enterSceneDoor'],
          this.interactiveStore.interactives['zombie'],
        ]),
        { enterSceneDoor: 'scene1' }
      ),
    };
  }
}

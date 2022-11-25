import { Injectable } from '@angular/core';

import { SceneEntity } from '../entities/scene.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { InventoryService } from '../services/inventory.service';
import { ArrayView } from '../views/array.view';
import { DescriptionStore } from './description.store';
import { InteractiveStore } from './interactive.store';
import { ItemStore } from './item.store';

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
        ]),
        { sceneExitDoor: 'scene2' }
      ),
      scene2: new SceneEntity(
        this.descriptionsStore.descriptions['scene2'],
        new ArrayView([
          this.interactiveStore.interactives['enterSceneDoor'],
          this.interactiveStore.interactives['trainingDummy'],
        ]),
        { enterSceneDoor: 'scene1' }
      ),
    };
  }
}

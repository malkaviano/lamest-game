import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { errorMessages } from '../definitions/error-messages.definition';

import { SceneDefinition } from '../definitions/scene.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { SceneEntity } from '../entities/scene.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ItemStore } from '../stores/item.store';
import { SceneStore } from '../stores/scene.store';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root',
})
export class NarrativeService {
  private currentScene: SceneEntity;

  private readonly sceneChanged: BehaviorSubject<SceneDefinition>;

  public readonly sceneChanged$: Observable<SceneDefinition>;

  constructor(
    itemStore: ItemStore,
    inventoryService: InventoryService,
    private readonly sceneStore: SceneStore
  ) {
    this.currentScene = this.sceneStore.scenes['scene1'];

    this.sceneChanged = new BehaviorSubject<SceneDefinition>(this.currentScene);

    this.sceneChanged$ = this.sceneChanged.asObservable();
  }

  public get interatives(): KeyValueInterface<InteractiveEntity> {
    let result: { [key: string]: InteractiveEntity } = {};

    return this.currentScene.interactives.items.reduce((acc, i) => {
      acc[i.id] = i;

      return acc;
    }, result);
  }

  public changeScene(action: ActionableEvent): void {
    if (action.actionableDefinition.actionable !== 'SCENE') {
      throw new Error(errorMessages['INVALID-OPERATION']);
    }

    const nextSceneName = this.currentScene.transitions[action.eventId];

    this.currentScene = this.sceneStore.scenes[nextSceneName];

    this.currentScene.reset();

    this.sceneChanged.next(this.currentScene);
  }
}

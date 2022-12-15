import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { errorMessages } from '../definitions/error-messages.definition';
import { SceneDefinition } from '../definitions/scene.definition';
import { SceneEntity } from '../entities/scene.entity';
import { ActionableEvent } from '../events/actionable.event';
import { SceneStore } from '../stores/scene.store';

@Injectable({
  providedIn: 'root',
})
export class NarrativeService {
  private currentScene: SceneEntity;

  private readonly sceneChanged: BehaviorSubject<SceneDefinition>;

  public readonly sceneChanged$: Observable<SceneDefinition>;

  constructor(private readonly sceneStore: SceneStore) {
    this.currentScene = this.sceneStore.scenes[this.sceneStore.initial];

    this.sceneChanged = new BehaviorSubject<SceneDefinition>(this.currentScene);

    this.sceneChanged$ = this.sceneChanged.asObservable();
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

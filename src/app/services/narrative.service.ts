import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SceneDefinition } from '../definitions/scene.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { SceneEntity } from '../entities/scene.entity';
import { ActionableEvent } from '../events/actionable.event';
import { ResultLiteral } from '../literals/result.literal';
import { SceneStore } from '../stores/scene.store';

@Injectable({
  providedIn: 'root',
})
export class NarrativeService {
  private currentScene: SceneEntity;

  private readonly sceneChanged: BehaviorSubject<SceneDefinition>;

  public readonly sceneChanged$: Observable<SceneDefinition>;

  constructor(private readonly sceneStore: SceneStore) {
    this.currentScene = this.sceneStore.scenes['scene1'];

    this.sceneChanged = new BehaviorSubject<SceneDefinition>(this.currentScene);

    this.sceneChanged$ = this.sceneChanged.asObservable();
  }

  public run(
    action: ActionableEvent,
    result: ResultLiteral
  ): InteractiveEntity {
    if (action.actionableDefinition.actionable === 'SCENE') {
      const nextSceneName = this.currentScene.transitions[action.interactiveId];

      this.currentScene = this.sceneStore.scenes[nextSceneName];

      this.currentScene.reset();

      this.sceneChanged.next(this.currentScene);

      return this.sceneStore.interactiveStore.interactives[
        action.interactiveId
      ];
    }

    return this.currentScene.run(action, result);
  }
}

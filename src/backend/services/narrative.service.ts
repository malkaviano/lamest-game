import { BehaviorSubject, Observable } from 'rxjs';

import { SceneDefinition } from '@definitions/scene.definition';
import { GameStringsStore } from '../../stores/game-strings.store';
import { SceneStore } from '../../stores/scene.store';
import { ActionableEvent } from '@events/actionable.event';
import { SceneEntity } from '@entities/scene.entity';

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
      throw new Error(GameStringsStore.errorMessages['INVALID-OPERATION']);
    }

    const nextSceneName = this.currentScene.transitions[action.eventId];

    this.currentScene = this.sceneStore.scenes[nextSceneName];

    this.currentScene.reset();

    this.sceneChanged.next(this.currentScene);
  }
}

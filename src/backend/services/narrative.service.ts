import { BehaviorSubject, Observable } from 'rxjs';

import { GameStringsStore } from '@stores/game-strings.store';
import { SceneStore } from '@stores/scene.store';
import { ActionableEvent } from '@events/actionable.event';
import { SceneEntity } from '@entities/scene.entity';

export class NarrativeService {
  private currentScene: SceneEntity;

  private readonly sceneChanged: BehaviorSubject<SceneEntity>;

  public readonly sceneChanged$: Observable<SceneEntity>;

  constructor(private readonly sceneStore: SceneStore) {
    this.currentScene = this.sceneStore.scenes[this.sceneStore.initial];

    this.sceneChanged = new BehaviorSubject<SceneEntity>(this.currentScene);

    this.sceneChanged$ = this.sceneChanged.asObservable();
  }

  public get currentSceneName(): string {
    return this.currentScene.label;
  }

  public changeScene(action: ActionableEvent): void {
    if (action.actionableDefinition.actionable !== 'SCENE') {
      throw new Error(GameStringsStore.errorMessages['INVALID-OPERATION']);
    }

    const nextSceneName =
      this.sceneStore.transitions[action.eventId][this.currentScene.name];

    this.currentScene = this.sceneStore.scenes[nextSceneName];

    this.currentScene.reset();

    this.sceneChanged.next(this.currentScene);
  }
}

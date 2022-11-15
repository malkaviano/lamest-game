import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActionableDefinition } from './definitions/actionable.definition';

import { ArrayView } from './definitions/array-view.definition';

import { Scene } from './definitions/scene.definition';
import { InteractiveEntity } from './entities/interactive.entity';
import { OpenedContainerState } from './states/opened-container.state';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private currentScene: Scene;

  private sceneChanged: BehaviorSubject<Scene>;

  private playerAction: Subject<ActionableDefinition>;

  sceneChanged$: Observable<Scene>;

  playerAction$: Observable<ActionableDefinition>;

  private readonly scenes = [
    new Scene(
      'scene1',
      [
        'You are in you room.',
        'The bed is unmade.',
        "There're leftovers from yesterday over the table",
        'And your mom is calling you downstairs',
      ],
      [
        new InteractiveEntity(
          'bed1',
          'BED',
          'Making your bed',
          new OpenedContainerState(new ArrayView([]))
        ),
        new InteractiveEntity(
          'food1',
          'LEFTOVERS',
          'Food?',
          new OpenedContainerState(new ArrayView([]))
        ),
        new InteractiveEntity(
          'exit1',
          'DOWNSTAIRS',
          'Leave',
          new OpenedContainerState(new ArrayView([]))
        ),
      ]
    ),
    new Scene(
      'scene2',
      ['This is the kitchen, your mom is angry and yelling at you!'],
      [
        new InteractiveEntity(
          'mom1',
          'Angry mom',
          'She is mad',
          new OpenedContainerState(new ArrayView([]))
        ),
      ]
    ),
  ];

  constructor() {
    this.currentScene = this.scenes[0];
    this.sceneChanged = new BehaviorSubject<Scene>(this.currentScene);
    this.sceneChanged$ = this.sceneChanged.asObservable();
    this.playerAction = new Subject<ActionableDefinition>();
    this.playerAction$ = this.playerAction.asObservable();
  }

  public registerEvent(event: ActionableDefinition) {
    this.playerAction.next(event);

    switch (event.name) {
      case 'OPEN':
        this.changeCurrentScene(1);

        this.sceneChanged.next(this.currentScene);
        break;
      default:
        break;
    }
  }

  private changeCurrentScene(index: number): void {
    this.currentScene = this.scenes[index];
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ActionSelected } from './definitions/action-selected.definition';
import { InteractiveEntity } from './entities/interactive.entity';
import { Scene } from './definitions/scene.definition';
import { SelectedActionEvent } from './events/selected-action.event';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private currentScene: Scene;

  private sceneChanged: BehaviorSubject<Scene>;

  private playerAction: Subject<string>;

  sceneChanged$: Observable<Scene>;

  playerAction$: Observable<string>;

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
        new InteractiveEntity('bed1', 'BED', 'Making your bed', [
          new ActionSelected('make_bed1', 'Make the bed'),
          new ActionSelected('make_bed2', 'Change bedclothes'),
        ]),
        new InteractiveEntity('food1', 'LEFTOVERS', 'Food?', [
          new ActionSelected('eat_food1', 'Eat leftovers'),
          new ActionSelected('throw_food1', 'Throw away'),
        ]),
        new InteractiveEntity('exit1', 'DOWNSTAIRS', 'Leave', [
          new ActionSelected('exit_room1', 'Exit'),
        ]),
      ]
    ),
    new Scene(
      'scene2',
      ['This is the kitchen, your mom is angry and yelling at you!'],
      [
        new InteractiveEntity('mom1', 'Angry mom', 'She is mad', [
          new ActionSelected('tank_mom1', 'Shut up!'),
          new ActionSelected('apologize_mom1', 'Sorry!'),
        ]),
      ]
    ),
  ];

  constructor() {
    this.currentScene = this.scenes[0];
    this.sceneChanged = new BehaviorSubject<Scene>(this.currentScene);
    this.sceneChanged$ = this.sceneChanged.asObservable();
    this.playerAction = new Subject<string>();
    this.playerAction$ = this.playerAction.asObservable();
  }

  public registerEvent(event: SelectedActionEvent) {
    this.playerAction.next(event.actionId);

    switch (event.actionId) {
      case 'exit_room1':
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

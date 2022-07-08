import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ActionSelection } from './definitions/action-selection.definition';
import { Interactive } from './definitions/interactive.definition';
import { Scene } from './definitions/scene.definition';
import { SelectedAction } from './definitions/selected-action.definition';

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
      'You are in you room.\n' +
        'The bed is unmade.\n' +
        "There're leftovers from yesterday over the table\n" +
        'And your mom is calling you downstairs\n',
      [
        new Interactive(
          'bed1',
          'BED',
          'Making your bed',
          'To make your bed is the best way to start the day',
          [
            new ActionSelection('make_bed1', 'Make the bed'),
            new ActionSelection('make_bed2', 'Change bedclothes'),
          ]
        ),
        new Interactive(
          'food1',
          'LEFTOVERS',
          'Food?',
          'Some food tastes better the day(s) after',
          [
            new ActionSelection('eat_food1', 'Eat leftovers'),
            new ActionSelection('throw_food1', 'Throw away'),
          ]
        ),
        new Interactive(
          'exit1',
          'DOWNSTAIRS',
          'Leave',
          "You mommy is calling, don't take too long",
          [new ActionSelection('exit_room1', 'Exit')]
        ),
      ]
    ),
    new Scene(
      'scene2',
      'This is the kitchen, your mom is angry and yelling at you!',
      [
        new Interactive(
          'mom1',
          'Angry mom',
          'She is mad',
          'After sleeping all day long, you deserve it',
          [
            new ActionSelection('tank_mom1', 'Shut up!'),
            new ActionSelection('apologize_mom1', 'Sorry!'),
          ]
        ),
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

  public registerEvent(event: SelectedAction) {
    this.playerAction.next(event.id);

    switch (event.id) {
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

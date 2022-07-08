import { Injectable } from '@angular/core';
import { ActionSelection } from './definitions/action-selection.definition';
import { Interactive } from './definitions/interactive.definition';
import { Scene } from './definitions/scene.definition';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private readonly scene: Scene;

  constructor() {
    this.scene = this.start();
  }

  public get currentScene(): Scene {
    return this.scene;
  }

  private start(): Scene {
    return new Scene(
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
    );
  }
}

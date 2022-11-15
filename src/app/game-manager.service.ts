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
        `O veículo de vocês parece acelerar um pouco mais e saltar um pouco menos. A estrada rústica dá lugar a uma rodovia asfaltada e mais luzes parecem se aproximar de vocês. Luzes de uma cidade que parece estar viva no cair da noite. A van atravessa o pórtico da cidade e é possível ler o letreiro que os recebe: “Boas vindas a Aurora, a cidade das flores”.`,
        `Algumas pessoas que caminham pelas ruas olham para vocês com um ar de curiosidade. Já outras olham com desconfiança. De uma forma ou de outra, existe uma certeza: vocês não são parte dessa cidade. São estranhos. Os olhares se intensificam quando vocês se aproximam da delegacia, onde Caio combinou de se encontrar com Larissa.`,
        `A investigadora os espera na porta da delegacia. Larissa Ribeiro é uma mulher jovem e magra, de óculos e cabelos presos num coque. Seu olhar é de preocupação. O uniforme da polícia está ligeiramente, escondido debaixo de um casaco mais grosso, para escapar do clima frio da cidade.`,
        `O veículo de vocês parece acelerar um pouco mais e saltar um pouco menos. A estrada rústica dá lugar a uma rodovia asfaltada e mais luzes parecem se aproximar de vocês. Luzes de uma cidade que parece estar viva no cair da noite. A van atravessa o pórtico da cidade e é possível ler o letreiro que os recebe: “Boas vindas a Aurora, a cidade das flores”.`,
        `Algumas pessoas que caminham pelas ruas olham para vocês com um ar de curiosidade. Já outras olham com desconfiança. De uma forma ou de outra, existe uma certeza: vocês não são parte dessa cidade. São estranhos. Os olhares se intensificam quando vocês se aproximam da delegacia, onde Caio combinou de se encontrar com Larissa.`,
        `A investigadora os espera na porta da delegacia. Larissa Ribeiro é uma mulher jovem e magra, de óculos e cabelos presos num coque. Seu olhar é de preocupação. O uniforme da polícia está ligeiramente, escondido debaixo de um casaco mais grosso, para escapar do clima frio da cidade.`,
        `O veículo de vocês parece acelerar um pouco mais e saltar um pouco menos. A estrada rústica dá lugar a uma rodovia asfaltada e mais luzes parecem se aproximar de vocês. Luzes de uma cidade que parece estar viva no cair da noite. A van atravessa o pórtico da cidade e é possível ler o letreiro que os recebe: “Boas vindas a Aurora, a cidade das flores”.`,
        `Algumas pessoas que caminham pelas ruas olham para vocês com um ar de curiosidade. Já outras olham com desconfiança. De uma forma ou de outra, existe uma certeza: vocês não são parte dessa cidade. São estranhos. Os olhares se intensificam quando vocês se aproximam da delegacia, onde Caio combinou de se encontrar com Larissa.`,
        `A investigadora os espera na porta da delegacia. Larissa Ribeiro é uma mulher jovem e magra, de óculos e cabelos presos num coque. Seu olhar é de preocupação. O uniforme da polícia está ligeiramente, escondido debaixo de um casaco mais grosso, para escapar do clima frio da cidade.`,
        `O veículo de vocês parece acelerar um pouco mais e saltar um pouco menos. A estrada rústica dá lugar a uma rodovia asfaltada e mais luzes parecem se aproximar de vocês. Luzes de uma cidade que parece estar viva no cair da noite. A van atravessa o pórtico da cidade e é possível ler o letreiro que os recebe: “Boas vindas a Aurora, a cidade das flores”.`,
        `Algumas pessoas que caminham pelas ruas olham para vocês com um ar de curiosidade. Já outras olham com desconfiança. De uma forma ou de outra, existe uma certeza: vocês não são parte dessa cidade. São estranhos. Os olhares se intensificam quando vocês se aproximam da delegacia, onde Caio combinou de se encontrar com Larissa.`,
        `A investigadora os espera na porta da delegacia. Larissa Ribeiro é uma mulher jovem e magra, de óculos e cabelos presos num coque. Seu olhar é de preocupação. O uniforme da polícia está ligeiramente, escondido debaixo de um casaco mais grosso, para escapar do clima frio da cidade.`,
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

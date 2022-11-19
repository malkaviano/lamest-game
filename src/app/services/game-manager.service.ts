import { Injectable } from '@angular/core';

import { BehaviorSubject, map, merge, Observable, Subject } from 'rxjs';

import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { SceneDefinition } from '../definitions/scene.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ConversationState } from '../states/conversation.state';
import { SimpleState } from '../states/simple.state';
import { CharacterEntity } from '../entities/character.entity';
import { CharacterManagerService } from '../services/character-manager.service';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private currentScene: SceneDefinition;

  private readonly sceneChanged: BehaviorSubject<SceneDefinition>;

  private readonly playerActed: Subject<ActionableDefinition>;

  private readonly characterChanged: BehaviorSubject<CharacterEntity>;

  private readonly scenes: { [key: string]: SceneDefinition };

  private readonly descriptions: { [key: string]: string[] };

  private readonly interactives: { [key: string]: InteractiveEntity };

  public readonly sceneChanged$: Observable<SceneDefinition>;

  public readonly playerActed$: Observable<ActionableDefinition>;

  public readonly actionLogged$: Observable<string>;

  public readonly characterChanged$: Observable<CharacterEntity>;

  constructor(
    private readonly characterManagerService: CharacterManagerService
  ) {
    this.characterChanged = new BehaviorSubject(
      this.characterManagerService.currentCharacter
    );

    this.characterChanged$ = this.characterChanged;

    this.descriptions = {
      scene1: [
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
      scene2: [
        'This is the exit',
        'Congratulations, this game is a piece of garbage',
      ],
    };

    this.interactives = {
      npc1: new InteractiveEntity(
        'npc1',
        'Carlos Joaquim',
        'Small guy with an ugly face wearing a cheap suit',
        new ConversationState(
          'npc1',
          {
            map1: {
              strange: {
                label: 'Strange sights',
                answer: 'I did see nothing',
              },
              things: {
                label: 'How are things',
                answer: 'So so, day by day',
              },
              bar: {
                label: 'Next bar',
                answer: 'Around the corner',
                change: 'map2',
              },
            },
            map2: {
              drink: {
                label: 'Want a drink?',
                answer: 'Fuck off',
                change: 'map1',
              },
            },
          },
          'map1'
        )
      ),
      sceneExitDoor: new InteractiveEntity(
        'sceneExitDoor',
        'Exit Door',
        'A strange door that may lead to the exit',
        new SimpleState(
          'sceneExitDoor',
          [actionableDefinitions['SCENE']('sceneExitDoor', 'exit', 'Exit')],
          'Leaving scene'
        )
      ),
      enterSceneDoor: new InteractiveEntity(
        'enterSceneDoor',
        'Enter scene',
        'Go inside to play this crap',
        new SimpleState(
          'enterSceneDoor',
          [actionableDefinitions['SCENE']('enterSceneDoor', 'enter', 'Enter')],
          'Entering scene'
        )
      ),
    };

    this.scenes = {
      scene1: new SceneDefinition(
        new ArrayView(this.descriptions['scene1']),
        new ArrayView([
          this.interactives['npc1'],
          this.interactives['sceneExitDoor'],
        ])
      ),
      scene2: new SceneDefinition(
        new ArrayView(this.descriptions['scene2']),
        new ArrayView([this.interactives['enterSceneDoor']])
      ),
    };

    this.currentScene = this.scenes['scene1'];

    this.sceneChanged = new BehaviorSubject<SceneDefinition>(this.currentScene);
    this.sceneChanged$ = this.sceneChanged.asObservable();

    this.playerActed = new Subject<ActionableDefinition>();
    this.playerActed$ = this.playerActed.asObservable();

    const interactiveKeys = Object.keys(this.interactives);

    interactiveKeys.forEach((key) =>
      this.interactives[key].actionSelected$.subscribe((action) => {
        this.playerActed.next(action);
      })
    );

    this.actionLogged$ = merge(
      ...interactiveKeys.map((key) => {
        return this.interactives[key].actionResult$.pipe(
          map((result) => {
            return `${result.interactiveName} => ${result.actionLog.label} => ${result.actionLog.msg}`;
          })
        );
      })
    );
  }

  public registerEvent(action: ActionableDefinition) {
    this.interactives[action.interactiveId].onActionSelected(action);

    if (action.action === 'SCENE') {
      if (action.interactiveId === 'sceneExitDoor') {
        this.currentScene = this.scenes['scene2'];
      }

      if (action.interactiveId === 'enterSceneDoor') {
        this.currentScene = this.scenes['scene1'];
      }

      this.sceneChanged.next(this.currentScene);
    }
  }
}

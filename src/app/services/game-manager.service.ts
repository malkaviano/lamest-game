import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { SceneDefinition } from '../definitions/scene.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ConversationState } from '../states/conversation.state';
import { SimpleState } from '../states/simple.state';
import { CharacterEntity } from '../entities/character.entity';
import { CharacterManagerService } from '../services/character-manager.service';
import { ArrayView } from '../views/array.view';
import { GameEventsDefinition } from '../definitions/game-events.definition';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private currentScene: SceneDefinition;

  private readonly gameLog: Subject<string>;

  private readonly sceneChanged: BehaviorSubject<SceneDefinition>;

  private readonly playerActed: Subject<ActionableDefinition>;

  private readonly characterChanged: BehaviorSubject<CharacterEntity>;

  private readonly scenes: { [key: string]: SceneDefinition };

  private readonly descriptions: { [key: string]: string[] };

  private readonly interactives: { [key: string]: InteractiveEntity };

  public readonly events: GameEventsDefinition;

  constructor(
    private readonly characterManagerService: CharacterManagerService
  ) {
    this.characterChanged = new BehaviorSubject(
      this.characterManagerService.currentCharacter
    );

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
        'NPC',
        'Demo Conversation Interactable',
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
        'Demo Simple Interactable',
        new SimpleState(
          'sceneExitDoor',
          [
            createActionableDefinition(
              'SCENE',
              'sceneExitDoor',
              'exit',
              'Exit'
            ),
          ],
          'Leaving scene'
        )
      ),
      enterSceneDoor: new InteractiveEntity(
        'enterSceneDoor',
        'Enter scene',
        'Demo Simple Interactable',
        new SimpleState(
          'enterSceneDoor',
          [
            createActionableDefinition(
              'SCENE',
              'enterSceneDoor',
              'enter',
              'Enter'
            ),
          ],
          'Entering scene'
        )
      ),
      hideShadows: new InteractiveEntity(
        'hideShadows',
        'Hide skill',
        'Demo using a skill',
        new SimpleState(
          'hideShadows',
          [createActionableDefinition('SKILL', 'hideShadows', 'Hide')],
          'Trying to hide'
        )
      ),
    };

    this.scenes = {
      scene1: new SceneDefinition(
        new ArrayView(this.descriptions['scene1']),
        new ArrayView([
          this.interactives['npc1'],
          this.interactives['sceneExitDoor'],
          this.interactives['hideShadows'],
        ])
      ),
      scene2: new SceneDefinition(
        new ArrayView(this.descriptions['scene2']),
        new ArrayView([this.interactives['enterSceneDoor']])
      ),
    };

    this.currentScene = this.scenes['scene1'];

    this.sceneChanged = new BehaviorSubject<SceneDefinition>(this.currentScene);

    this.playerActed = new Subject<ActionableDefinition>();

    this.gameLog = new Subject<string>();

    this.events = new GameEventsDefinition(
      this.sceneChanged.asObservable(),
      this.playerActed.asObservable(),
      this.gameLog.asObservable(),
      this.characterChanged.asObservable(),
      (action: ActionableDefinition) => this.actionableReceived(action)
    );
  }

  private actionableReceived(action: ActionableDefinition): void {
    const interactive = this.interactives[action.interactiveId];

    this.gameLog.next(`${interactive.name} - ${action.label}`);

    if (action.actionable === 'SCENE') {
      if (action.interactiveId === 'sceneExitDoor') {
        this.currentScene = this.scenes['scene2'];
      }

      if (action.interactiveId === 'enterSceneDoor') {
        this.currentScene = this.scenes['scene1'];
      }

      this.sceneChanged.next(this.currentScene);
    }

    if (action.actionable === 'SKILL') {
      const skillName = action.name;
      const skillValue =
        this.characterManagerService.currentCharacter.skills[skillName];

      if (skillValue) {
        console.log(skillName, skillValue);

        // TODO: Roll skill and decide what to do
      }
    }

    // TODO: Improve message sent
    interactive.onActionSelected(action);
  }
}

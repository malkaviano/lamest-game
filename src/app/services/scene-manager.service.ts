import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { SceneDefinition } from '../definitions/scene.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { SceneEntity } from '../entities/scene.entity';
import { ResultLiteral } from '../literals/result.literal';
import { ConversationState } from '../states/conversation.state';
import { SimpleState } from '../states/simple.state';
import { SkillState } from '../states/skill.state';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private currentScene: SceneEntity;

  private readonly descriptions: { [key: string]: string[] };

  private readonly interactives: { [key: string]: InteractiveEntity };

  private readonly scenes: { [key: string]: SceneEntity };

  private readonly sceneTransitions: { [key: string]: string };

  private readonly sceneChanged: BehaviorSubject<SceneDefinition>;

  public readonly sceneChanged$: Observable<SceneDefinition>;

  constructor() {
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
        'This is the outside yard',
        `There's only garden around you and the door leading back to the room`,
        `One bush thou catches your attention, it seems a little weird`,
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
        new SimpleState('sceneExitDoor', [
          createActionableDefinition('SCENE', 'sceneExitDoor', 'exit', 'Exit'),
        ])
      ),
      athleticism: new InteractiveEntity(
        'athleticism',
        'Athleticism skill',
        'Demo failing a skill with 2 tries',
        new SkillState(
          'athleticism',
          createActionableDefinition('SKILL', 'athleticism', 'Athleticism'),
          new SimpleState('athleticism', [
            createActionableDefinition(
              'PICK',
              'athleticism',
              'secretItem',
              'Item'
            ),
          ]),
          2
        )
      ),
      enterSceneDoor: new InteractiveEntity(
        'enterSceneDoor',
        'Enter room',
        'Change to another scene',
        new SimpleState('enterSceneDoor', [
          createActionableDefinition(
            'SCENE',
            'enterSceneDoor',
            'enter',
            'Enter'
          ),
        ])
      ),
      strangeBush: new InteractiveEntity(
        'strangeBush',
        'A weird bush',
        'Try to spot something',
        new SimpleState('', [
          createActionableDefinition('SKILL', 'strangeBush', 'Spot'),
        ])
      ),
    };

    this.scenes = {
      scene1: new SceneEntity(
        new ArrayView(this.descriptions['scene1']),
        new ArrayView([
          this.interactives['npc1'],
          this.interactives['sceneExitDoor'],
          this.interactives['athleticism'],
        ])
      ),
      scene2: new SceneEntity(
        new ArrayView(this.descriptions['scene2']),
        new ArrayView([
          this.interactives['enterSceneDoor'],
          this.interactives['strangeBush'],
        ])
      ),
    };

    this.sceneTransitions = {
      sceneExitDoor: 'scene2',
      enterSceneDoor: 'scene1',
    };

    this.currentScene = this.scenes['scene1'];

    this.sceneChanged = new BehaviorSubject<SceneDefinition>(this.currentScene);

    this.sceneChanged$ = this.sceneChanged.asObservable();
  }

  public run(
    action: ActionableDefinition,
    result: ResultLiteral
  ): InteractiveEntity {
    if (action.actionable === 'SCENE') {
      const nextSceneName = this.sceneTransitions[action.interactiveId];

      this.currentScene = this.scenes[nextSceneName];

      this.currentScene.reset();

      this.sceneChanged.next(this.currentScene);

      return this.interactives[action.interactiveId];
    }

    return this.currentScene.run(action, result);
  }
}

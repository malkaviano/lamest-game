import { Injectable } from '@angular/core';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ConversationState } from '../states/conversation.state';
import { SimpleState } from '../states/simple.state';
import { SkillState } from '../states/skill.state';

@Injectable({
  providedIn: 'root',
})
export class InteractiveStore {
  public readonly interactives: { [key: string]: InteractiveEntity };

  constructor() {
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
  }
}

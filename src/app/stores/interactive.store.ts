import { Injectable } from '@angular/core';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ConversationState } from '../states/conversation.state';
import { DestroyableState } from '../states/destroyable.state';
import { DiscardState } from '../states/discard.state';
import { emptyState } from '../states/empty.state';
import { EnemyState } from '../states/enemy.state';
import { SimpleState } from '../states/simple.state';
import { SkillState } from '../states/skill.state';

@Injectable({
  providedIn: 'root',
})
export class InteractiveStore {
  public readonly interactives: KeyValueInterface<InteractiveEntity>;

  public readonly usedItems: KeyValueInterface<KeyValueInterface<number>>;

  constructor() {
    this.interactives = {
      npc1: new InteractiveEntity(
        'npc1',
        'NPC',
        'Demo Conversation Interactable',
        new ConversationState(
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
        new SimpleState([
          createActionableDefinition('SCENE', 'sceneExitDoor', 'Exit'),
        ])
      ),
      upperShelf: new InteractiveEntity(
        'upperShelf',
        'Upper Shelf',
        'Demo failing a skill with 2 tries',
        new SkillState(
          createActionableDefinition('SKILL', 'Athleticism'),
          new DiscardState([
            createActionableDefinition('PICK', 'knife', 'Hunting Knife'),
            createActionableDefinition('PICK', 'firstAid', 'First Aid Kit'),
            createActionableDefinition('PICK', 'firstAid', 'First Aid Kit'),
            createActionableDefinition('PICK', 'halberd', 'Halberd'),
          ]),
          2
        ),
        false
      ),
      enterSceneDoor: new InteractiveEntity(
        'enterSceneDoor',
        'Enter room',
        'Change to another scene',
        new SimpleState([
          createActionableDefinition('SCENE', 'enterSceneDoor', 'Enter'),
        ])
      ),
      trainingDummy: new InteractiveEntity(
        'trainingDummy',
        'Training Dummy',
        'Try some attack moves here',
        new EnemyState(
          [createActionableDefinition('ATTACK', 'attack', 'Attack')],
          emptyState,
          6,
          new DamageDefinition(createDice(), 1),
          30
        ),
        false
      ),
      woodBox: new InteractiveEntity(
        'woodBox',
        'Wood Box',
        'Old Wood Box',
        new DestroyableState(
          [createActionableDefinition('ATTACK', 'attack', 'Attack')],
          new DiscardState([
            createActionableDefinition('PICK', 'club', 'Wood Stick'),
          ]),
          5
        ),
        false
      ),
    };

    this.usedItems = {
      upperShelf: {
        knife: 1,
        firstAid: 2,
        halberd: 1,
      },
      woodBox: {
        club: 1,
      },
    };
  }
}

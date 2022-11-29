import { Injectable } from '@angular/core';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActionableState } from '../states/actionable.state';
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
export class StatesStore {
  private readonly store: Map<string, ActionableState>;
  constructor(private readonly converterHelper: ConverterHelper) {
    this.store = new Map<string, ActionableState>();

    this.store.set(
      'npcConversation',
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
    );

    this.store.set(
      'exitDoor',
      new SimpleState([
        createActionableDefinition('SCENE', 'sceneExitDoor', 'Exit'),
      ])
    );

    this.store.set(
      'shelfLoot',
      new DiscardState([
        createActionableDefinition('PICK', 'knife', 'Hunting Knife'),
        createActionableDefinition('PICK', 'firstAid', 'First Aid Kit'),
        createActionableDefinition('PICK', 'firstAid', 'First Aid Kit'),
      ])
    );

    this.store.set(
      'shelfJump',
      new SkillState(
        createActionableDefinition('SKILL', 'Athleticism'),
        this.states['shelfLoot'],
        2
      )
    );

    this.store.set(
      'enterDoor',
      new SimpleState([
        createActionableDefinition('SCENE', 'enterSceneDoor', 'Enter'),
      ])
    );

    this.store.set(
      'trainingDummy',
      new EnemyState(
        [createActionableDefinition('ATTACK', 'attack', 'Attack')],
        emptyState,
        6,
        new DamageDefinition(createDice(), 1),
        30
      )
    );

    this.store.set(
      'lootWoodBox',
      new DiscardState([
        createActionableDefinition('PICK', 'club', 'Wood Stick'),
      ])
    );

    this.store.set(
      'woodBox',
      new DestroyableState(
        [createActionableDefinition('ATTACK', 'attack', 'Attack')],
        this.states['lootWoodBox'],
        5
      )
    );

    this.store.set(
      'zombie',
      new EnemyState(
        [createActionableDefinition('ATTACK', 'attack', 'Attack')],
        emptyState,
        10,
        new DamageDefinition(createDice({ D6: 1 }), 1),
        45
      )
    );

    this.store.set(
      'corridorDoor',
      new SimpleState([
        createActionableDefinition('SCENE', 'corridorDoor', 'Enter'),
      ])
    );

    this.store.set(
      'tableLoot',
      new DiscardState([
        createActionableDefinition('PICK', 'halberd', 'Halberd'),
        createActionableDefinition('PICK', 'bubbleGum', 'Bubble Gum'),
      ])
    );
  }

  public get states(): KeyValueInterface<ActionableState> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

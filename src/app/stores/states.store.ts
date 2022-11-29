import { Injectable } from '@angular/core';

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
import { ActionableStore } from './actionable.store';
import { MessageStore } from './message.store';

@Injectable({
  providedIn: 'root',
})
export class StatesStore {
  private readonly store: Map<string, ActionableState>;
  constructor(
    private readonly converterHelper: ConverterHelper,
    private readonly messageStore: MessageStore,
    private readonly actionableStore: ActionableStore
  ) {
    this.store = new Map<string, ActionableState>();

    this.store.set(
      'npcConversation',
      new ConversationState(this.messageStore.store, 'map1')
    );

    this.store.set(
      'exitDoor',
      new SimpleState([this.actionableStore.actionables['sceneExitDoor']])
    );

    this.store.set(
      'shelfLoot',
      new DiscardState([
        this.actionableStore.actionables['knife'],
        this.actionableStore.actionables['firstAid'],
        this.actionableStore.actionables['firstAid'],
      ])
    );

    this.store.set(
      'shelfJump',
      new SkillState(
        this.actionableStore.actionables['Athleticism'],
        this.states['shelfLoot'],
        2
      )
    );

    this.store.set(
      'enterDoor',
      new SimpleState([this.actionableStore.actionables['enterSceneDoor']])
    );

    this.store.set(
      'trainingDummy',
      new EnemyState(
        [this.actionableStore.actionables['attack']],
        emptyState,
        6,
        new DamageDefinition(createDice(), 1),
        30
      )
    );

    this.store.set(
      'lootWoodBox',
      new DiscardState([this.actionableStore.actionables['club']])
    );

    this.store.set(
      'woodBox',
      new DestroyableState(
        [this.actionableStore.actionables['attack']],
        this.states['lootWoodBox'],
        5
      )
    );

    this.store.set(
      'zombie',
      new EnemyState(
        [this.actionableStore.actionables['attack']],
        emptyState,
        10,
        new DamageDefinition(createDice({ D6: 1 }), 1),
        45
      )
    );

    this.store.set(
      'corridorDoor',
      new SimpleState([this.actionableStore.actionables['corridorDoor']])
    );

    this.store.set(
      'tableLoot',
      new DiscardState([
        this.actionableStore.actionables['halberd'],
        this.actionableStore.actionables['bubbleGum'],
      ])
    );
  }

  public get states(): KeyValueInterface<ActionableState> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

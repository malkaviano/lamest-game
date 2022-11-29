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
import { ArrayView } from '../views/array.view';

import skillStateStore from '../../assets/skill-states.json';
import discardStateStore from '../../assets/discard-states.json';
import simpleStateStore from '../../assets/simple-states.json';
import conversationStateStore from '../../assets/conversation-states.json';
import destroyableStateStore from '../../assets/destroyable-states.json';
import enemyStateStore from '../../assets/enemy-states.json';
import { LazyHelper } from '../helpers/lazy.helper';

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

    this.store.set('emptyState', emptyState);

    skillStateStore.states.forEach((state) => {
      this.store.set(
        state.interactiveId,
        new SkillState(
          this.actionableStore.actionables[state.actionable],
          new LazyHelper(() => this.states[state.successState]),
          state.maximumTries
        )
      );
    });

    discardStateStore.states.forEach((state) => {
      const actionables = this.getActionables(state);

      this.store.set(state.interactiveId, new DiscardState(actionables));
    });

    simpleStateStore.states.forEach((state) => {
      const actionables = this.getActionables(state);

      this.store.set(state.interactiveId, new SimpleState(actionables));
    });

    conversationStateStore.states.forEach((state) => {
      const map = state.maps.reduce((map: { [key: string]: any }, mapName) => {
        map[mapName] = this.messageStore.store[mapName];

        return map;
      }, {});

      this.store.set(
        state.interactiveId,
        new ConversationState(map, state.initialMap)
      );
    });

    destroyableStateStore.states.forEach((state) => {
      const actionables = this.getActionables(state);

      this.store.set(
        state.interactiveId,
        new DestroyableState(
          actionables,
          new LazyHelper(() => this.states[state.destroyedState]),
          state.hitpoints
        )
      );
    });

    enemyStateStore.states.forEach((state) => {
      const actionables = this.getActionables(state);

      this.store.set(
        state.interactiveId,
        new EnemyState(
          actionables,
          new LazyHelper(() => this.states[state.killedState]),
          state.hitpoints,
          new DamageDefinition(
            createDice(state.damage.dice),
            state.damage.fixed
          ),
          state.attackSkillValue,
          state.onlyReact
        )
      );
    });
  }

  public get states(): KeyValueInterface<ActionableState> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }

  private getActionables(state: {
    interactiveId: string;
    actionables: string[];
  }) {
    return new ArrayView(
      state.actionables.map((a) => this.actionableStore.actionables[a])
    );
  }
}

import { Injectable } from '@angular/core';

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
import { LazyHelper } from '../helpers/lazy.helper';
import { ItemStore } from './item.store';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class StatesStore {
  private readonly store: Map<string, ActionableState>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    messageStore: MessageStore,
    actionableStore: ActionableStore,
    resourcesStore: ResourcesStore,
    itemStore: ItemStore
  ) {
    this.store = new Map<string, ActionableState>();

    this.store.set('emptyState', emptyState);

    resourcesStore.skillStateStore.states.forEach((state) => {
      this.store.set(
        state.interactiveId,
        new SkillState(
          actionableStore.actionables[state.actionable],
          this.lazyState(state.successState),
          state.maximumTries
        )
      );
    });

    resourcesStore.discardStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(state.interactiveId, new DiscardState(actionables));
    });

    resourcesStore.simpleStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(state.interactiveId, new SimpleState(actionables));
    });

    resourcesStore.conversationStateStore.states.forEach((state) => {
      const map = state.maps.reduce((map: { [key: string]: any }, mapName) => {
        map[mapName] = messageStore.messages[mapName];

        return map;
      }, {});

      this.store.set(
        state.interactiveId,
        new ConversationState(map, state.initialMap)
      );
    });

    resourcesStore.destroyableStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(
        state.interactiveId,
        new DestroyableState(
          actionables,
          this.lazyState(state.destroyedState),
          state.hitpoints
        )
      );
    });

    resourcesStore.enemyStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(
        state.interactiveId,
        new EnemyState(
          actionables,
          this.lazyState(state.killedState),
          state.hitpoints,
          itemStore.items[state.weaponName] as WeaponDefinition,
          state.attackSkillValue,
          state.behavior
        )
      );
    });
  }

  public get states(): KeyValueInterface<ActionableState> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }

  public lazyState(stateName: string): LazyHelper<ActionableState> {
    return new LazyHelper(() => this.states[stateName]);
  }

  private getActionables(
    actionableStore: ActionableStore,
    state: {
      interactiveId: string;
      actionables: string[];
    }
  ) {
    return new ArrayView(
      state.actionables.map((a) => actionableStore.actionables[a])
    );
  }
}

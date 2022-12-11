import { Injectable } from '@angular/core';

import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActionableState } from '../states/actionable.state';
import { ConversationState } from '../states/conversation.state';
import { DestroyableState } from '../states/destroyable.state';
import { DiscardState } from '../states/discard.state';
import { emptyState } from '../states/empty.state';
import { SimpleState } from '../states/simple.state';
import { SkillState } from '../states/skill.state';
import { ActionableStore } from './actionable.store';
import { MessageStore } from './message.store';
import { ArrayView } from '../views/array.view';
import { LazyHelper } from '../helpers/lazy.helper';
import { ResourcesStore } from './resources.store';
import { LockedContainerState } from '../states/locked-container';

@Injectable({
  providedIn: 'root',
})
export class StatesStore {
  private readonly store: Map<string, ActionableState>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    messageStore: MessageStore,
    actionableStore: ActionableStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, ActionableState>();

    this.store.set('emptyState', emptyState);

    resourcesStore.skillStateStore.states.forEach((state) => {
      this.store.set(
        state.id,
        new SkillState(
          actionableStore.actionables[state.actionable],
          this.lazyState(state.successState),
          state.maximumTries
        )
      );
    });

    resourcesStore.discardStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(state.id, new DiscardState(actionables));
    });

    resourcesStore.simpleStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(state.id, new SimpleState(actionables));
    });

    resourcesStore.conversationStateStore.states.forEach((state) => {
      const map = state.maps.reduce(
        (
          map: {
            [key: string]: {
              [key: string]: {
                label: string;
                answer: string;
                change?: string;
              };
            };
          },
          mapName
        ) => {
          map[mapName] = messageStore.messages[mapName];

          return map;
        },
        {}
      );

      this.store.set(state.id, new ConversationState(map, state.initialMap));
    });

    resourcesStore.destroyableStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(
        state.id,
        new DestroyableState(
          actionables,
          this.lazyState(state.destroyedState),
          state.hitpoints
        )
      );
    });

    resourcesStore.lockedContainerStateStore.states.forEach((state) => {
      const actionables = this.getActionables(actionableStore, state);

      this.store.set(
        state.id,
        new LockedContainerState(actionables, this.lazyState(state.openedState))
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
      id: string;
      actionables: string[];
    }
  ) {
    return new ArrayView(
      state.actionables.map((a) => actionableStore.actionables[a])
    );
  }
}

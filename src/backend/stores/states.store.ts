import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ActionableState } from '@states/actionable.state';
import { ConversationState } from '@states/conversation.state';
import { DestroyableState } from '@states/destroyable.state';
import { DiscardState } from '@states/discard.state';
import { emptyState } from '@states/empty.state';
import { SimpleState } from '@states/simple.state';
import { SkillState } from '@states/skill.state';
import { ActionableStore } from './actionable.store';
import { MessageStore } from './message.store';
import { ResourcesStore } from './resources.store';
import { LockedContainerState } from '@states/locked-container.state';
import { LockPickingContainerState } from '@states/lock-picking-container.state';
import {
  directionActionableDefinition,
  directionNamesDefinition,
} from '@definitions/directions.definition';
import { VisibilityState } from '@states/visibility.state';
import { ArrayView } from '@wrappers/array.view';
import { LazyHelper } from '@helpers/lazy.helper';
import { ConverterHelper } from '@helpers/converter.helper';
import { SequencerHelper } from '@helpers/sequencer.helper';
import { LockPickableContainerState } from '@states/lock-pickable-container.state';

export class StatesStore {
  private readonly store: Map<string, ActionableState>;

  constructor(
    messageStore: MessageStore,
    actionableStore: ActionableStore,
    resourcesStore: ResourcesStore,
    sequencerHelper: SequencerHelper
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

      const allDirectionsDefinition = directionNamesDefinition.items.map(
        (direction) => {
          return directionActionableDefinition(direction, `Turn ${direction}`);
        }
      );

      const pickLockActionable =
        actionableStore.actionables['interactionPickLock'];

      const locked = state.lockPicking
        ? new LockPickableContainerState(
            actionables.insert(pickLockActionable),
            new LockPickingContainerState(
              ArrayView.fromArray(allDirectionsDefinition),
              actionables,
              this.lazyState(state.openedState),
              ArrayView.fromArray(
                sequencerHelper.lockPickSequence(state.lockPicking.complexity)
              ),
              state.lockPicking.maximumTries
            ),
            this.lazyState(state.openedState)
          )
        : new LockedContainerState(
            actionables,
            this.lazyState(state.openedState)
          );

      this.store.set(state.id, locked);
    });

    resourcesStore.visibilityStateStore.states.forEach((state) => {
      this.store.set(
        state.id,
        new VisibilityState(
          actionableStore.actionables[state.actionable],
          state.maximumTries
        )
      );
    });
  }

  public get states(): KeyValueInterface<ActionableState> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
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
    return ArrayView.fromArray(
      state.actionables.map((a) => actionableStore.actionables[a])
    );
  }
}
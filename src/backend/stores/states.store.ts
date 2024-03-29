import { ActionableState } from '@states/actionable.state';
import { ConversationState } from '@states/conversation.state';
import { DestroyableState } from '@states/destroyable.state';
import { DiscardState } from '@states/discard.state';
import { emptyState } from '@states/empty.state';
import { SimpleState } from '@states/simple.state';
import { SkillState } from '@states/skill.state';
import { ActionableStore } from '@stores/actionable.store';
import { MessageStore } from '@stores/message.store';
import { ResourcesStore } from '@stores/resources.store';
import { LockedContainerState } from '@states/locked-container.state';
import { LockPickingContainerState } from '@states/lock-picking-container.state';
import {
  directionActionableDefinition,
  directionNamesDefinition,
} from '@definitions/directions.definition';
import { ArrayView } from '@wrappers/array.view';
import { LazyHelper } from '@helpers/lazy.helper';
import { ConverterHelper } from '@helpers/converter.helper';
import { LockPickableContainerState } from '@states/lock-pickable-container.state';
import {
  affectActionable,
  createActionableDefinition,
} from '@definitions/actionable.definition';
import { ItemStore } from '@stores/item.store';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { GameStringsStore } from '@stores/game-strings.store';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { RandomIntHelper } from '@helpers/random-int.helper';

export class StatesStore {
  private readonly store: Map<string, ActionableState>;

  private readonly mLoot: Map<string, GameItemDefinition[]>;

  constructor(
    messageStore: MessageStore,
    actionableStore: ActionableStore,
    resourcesStore: ResourcesStore,
    sequencerHelper: RandomIntHelper,
    itemStore: ItemStore
  ) {
    this.store = new Map<string, ActionableState>();

    this.store.set('emptyState', emptyState);

    this.mLoot = new Map<string, GameItemDefinition[]>();

    resourcesStore.skillStateStore.states.forEach((state) => {
      this.store.set(
        state.id,
        new SkillState(
          createActionableDefinition('SKILL', state.skillName, state.skillName),
          this.lazyState(state.successState),
          state.maximumTries
        )
      );
    });

    resourcesStore.discardStateStore.states.forEach((state) => {
      const actionables = state.items.map((itemName) => {
        const item = itemStore.items[itemName];

        const items = this.mLoot.get(state.interactiveId) ?? [];

        items.push(item);

        this.mLoot.set(state.interactiveId, items);

        return createActionableDefinition(
          'PICK',
          item.identity.name,
          item.identity.label
        );
      });

      this.store.set(
        state.id,
        new DiscardState(ArrayView.fromArray(actionables))
      );
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
      this.store.set(
        state.id,
        new DestroyableState(
          ArrayView.create(affectActionable),
          this.lazyState(state.lootState),
          state.hitpoints
        )
      );
    });

    resourcesStore.lockedContainerStateStore.states.forEach((state) => {
      const keyName = state.keyName;

      const key = itemStore.items[keyName];

      const actionables = ArrayView.create(
        createActionableDefinition('USE', key.identity.name, key.identity.label)
      );

      const allDirectionsDefinition = directionNamesDefinition.items.map(
        (direction) => {
          return directionActionableDefinition(
            direction,
            GameStringsStore.labels[direction]
          );
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
  }

  public get states(): ReadonlyKeyValueWrapper<ActionableState> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }

  public get loot(): ReadonlyKeyValueWrapper<GameItemDefinition[]> {
    return ConverterHelper.mapToKeyValueInterface(this.mLoot);
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

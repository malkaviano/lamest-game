import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { StatesStore } from '@stores/states.store';
import { ConverterHelper } from '@helpers/converter.helper';
import { ResourcesStore } from '@stores/resources.store';
import { InteractiveEntity } from '@entities/interactive.entity';

export class InteractiveStore {
  private readonly store: Map<string, InteractiveEntity>;

  constructor(stateStore: StatesStore, resourcesStore: ResourcesStore) {
    this.store = new Map<string, InteractiveEntity>();

    resourcesStore.interactiveStore.interactives.forEach(
      ({ id, name, description, state, resettable }) => {
        this.store.set(
          id,
          new InteractiveEntity(
            id,
            name,
            description,
            stateStore.states[state],
            resettable,
            'VISIBLE'
          )
        );
      }
    );
  }

  public get interactives(): ReadonlyKeyValueWrapper<InteractiveEntity> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}

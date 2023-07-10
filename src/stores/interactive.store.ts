import { KeyValueInterface } from '@interfaces/key-value.interface';
import { StatesStore } from './states.store';
import { ConverterHelper } from '@conceptual/helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { InteractiveEntity } from '@conceptual/entities/interactive.entity';

export class InteractiveStore {
  private readonly store: Map<string, InteractiveEntity>;

  private readonly items: Map<
    string,
    {
      readonly name: string;
      readonly quantity: number;
    }[]
  >;

  constructor(stateStore: StatesStore, resourcesStore: ResourcesStore) {
    this.store = new Map<string, InteractiveEntity>();

    this.items = new Map<
      string,
      {
        readonly name: string;
        readonly quantity: number;
      }[]
    >();

    resourcesStore.interactiveStore.interactives.forEach(
      ({ id, name, description, state, resettable }) => {
        this.store.set(
          id,
          new InteractiveEntity(
            id,
            name,
            description,
            stateStore.states[state],
            resettable
          )
        );
      }
    );

    resourcesStore.interactiveStore.inventoryItems.forEach(({ id, items }) => {
      this.items.set(id, items);
    });
  }

  public get interactives(): KeyValueInterface<InteractiveEntity> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }

  public get interactiveItems(): KeyValueInterface<
    {
      readonly name: string;
      readonly quantity: number;
    }[]
  > {
    return ConverterHelper.mapToKeyValueInterface(this.items);
  }
}

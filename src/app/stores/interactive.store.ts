import { Injectable } from '@angular/core';

import { InteractiveEntity } from '../entities/interactive.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { StatesStore } from './states.store';
import { ConverterHelper } from '../helpers/converter.helper';

import interactiveStore from '../../assets/interactives.json';

@Injectable({
  providedIn: 'root',
})
export class InteractiveStore {
  private readonly store: Map<string, InteractiveEntity>;

  private readonly interactiveItems: Map<string, KeyValueInterface<number>>;

  constructor(
    private readonly stateStore: StatesStore,
    private readonly converterHelper: ConverterHelper
  ) {
    this.store = new Map<string, InteractiveEntity>();

    interactiveStore.interactives.forEach(
      ({ id, name, description, state, resettable }) => {
        this.store.set(
          id,
          new InteractiveEntity(
            id,
            name,
            description,
            this.stateStore.states[state],
            resettable
          )
        );
      }
    );

    this.interactiveItems = new Map<string, KeyValueInterface<number>>();

    interactiveStore.usedItems.forEach((usedItem) => {
      const r = usedItem.items.reduce((obj: any, item) => {
        obj[item.name] = item.quantity;

        return obj;
      }, {});

      this.interactiveItems.set(usedItem.id, r);
    });
  }

  public get interactives(): KeyValueInterface<InteractiveEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }

  public get usedItems(): KeyValueInterface<KeyValueInterface<number>> {
    return this.converterHelper.mapToKeyValueInterface(this.interactiveItems);
  }
}

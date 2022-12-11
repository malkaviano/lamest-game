import { Injectable } from '@angular/core';

import { InteractiveEntity } from '../entities/interactive.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { StatesStore } from './states.store';
import { ConverterHelper } from '../helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from './item.store';

@Injectable({
  providedIn: 'root',
})
export class InteractiveStore {
  private readonly store: Map<string, InteractiveEntity>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    inventoryService: InventoryService,
    stateStore: StatesStore,
    itemStore: ItemStore,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, InteractiveEntity>();

    resourcesStore.interactiveStore.interactives.forEach(
      ({ id, name, description, state, resettable }) => {
        console.log(id, name, description, state, resettable);
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

    resourcesStore.interactiveStore.usedItems.forEach(({ id, items }) => {
      items.forEach(({ name, quantity }) => {
        for (let index = 0; index < quantity; index++) {
          inventoryService.store(id, itemStore.items[name]);
        }
      });
    });
  }

  public get interactives(): KeyValueInterface<InteractiveEntity> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}

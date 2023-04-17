import { Injectable } from '@angular/core';

import { KeyValueInterface } from '../core/interfaces/key-value.interface';
import { StatesStore } from './states.store';
import { ConverterHelper } from '../backend/helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { InventoryService } from '../backend/services/inventory.service';
import { ItemStore } from './item.store';
import { InteractiveEntity } from '../core/entities/interactive.entity';

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

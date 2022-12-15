import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { errorMessages } from '../definitions/error-messages.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ItemStoredDefinition } from '../definitions/item-storage.definition';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly inventoryChanged: Subject<InventoryEvent>;

  private storage: Map<string, { [key: string]: ItemStoredDefinition }>;

  public readonly inventoryChanged$: Observable<InventoryEvent>;

  constructor() {
    this.storage = new Map<string, { [key: string]: ItemStoredDefinition }>();

    this.inventoryChanged = new Subject<InventoryEvent>();

    this.inventoryChanged$ = this.inventoryChanged.asObservable();
  }

  public store(key: string, item: GameItemDefinition): number {
    const storage = this.getStorage(key);

    const itemStored = storage[item.identity.name];

    const quantity = (itemStored?.quantity ?? 0) + 1;

    const itemStorage = new ItemStoredDefinition(item, quantity);

    storage[item.identity.name] = itemStorage;

    this.storage.set(key, storage);

    this.inventoryChanged.next(new InventoryEvent('STORE', key, item));

    return quantity;
  }

  public take(key: string, name: string): GameItemDefinition {
    const storage = this.getStorage(key);

    if (!storage[name]) {
      throw new Error(errorMessages['INVALID-OPERATION']);
    }

    const itemStored = storage[name];

    const quantity = itemStored.quantity - 1;

    if (quantity) {
      storage[name] = new ItemStoredDefinition(itemStored.item, quantity);
    } else {
      delete storage[name];
    }

    this.inventoryChanged.next(
      new InventoryEvent('TAKE', key, itemStored.item)
    );

    return itemStored.item;
  }

  public check(key: string): ArrayView<ItemStoredDefinition> {
    const storage = this.getStorage(key);

    const result: ItemStoredDefinition[] = [];

    const a = Object.entries(storage).reduce((acc, [, item]) => {
      acc.push(item);

      return acc;
    }, result);

    return ArrayView.create(a);
  }

  private getStorage(key: string): {
    [key: string]: ItemStoredDefinition;
  } {
    return this.storage.get(key) ?? {};
  }
}

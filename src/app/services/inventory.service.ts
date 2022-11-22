import { Injectable } from '@angular/core';
import { errorMessages } from '../definitions/error-messages.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private storage: Map<string, { [key: string]: ItemStorageDefinition }>;

  constructor() {
    this.storage = new Map<string, { [key: string]: ItemStorageDefinition }>();
  }

  public store(key: string, item: GameItemDefinition): number {
    const storage = this.getStorage(key);

    const itemStored = storage[item.name];

    const quantity = (itemStored?.quantity ?? 0) + 1;

    const itemStorage = new ItemStorageDefinition(item, quantity);

    storage[item.name] = itemStorage;

    this.storage.set(key, storage);

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
      storage[name] = new ItemStorageDefinition(itemStored.item, quantity);
    } else {
      delete storage[name];
    }

    return itemStored.item;
  }

  public check(key: string): ArrayView<ItemStorageDefinition> {
    const storage = this.getStorage(key);

    const result: ItemStorageDefinition[] = [];

    const a = Object.entries(storage).reduce((acc, [_, item]) => {
      acc.push(item);

      return acc;
    }, result);

    return new ArrayView(a);
  }

  private getStorage(key: string): {
    [key: string]: ItemStorageDefinition;
  } {
    return this.storage.get(key) ?? {};
  }
}

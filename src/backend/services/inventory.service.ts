import { Observable, Subject } from 'rxjs';

import { ConsumableDefinition } from '@definitions/consumable.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemStoredDefinition } from '@definitions/item-storage.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { UsableDefinition } from '@definitions/usable.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ArrayView } from '@wrappers/array.view';
import { InventoryEvent } from '@events/inventory.event';
import { ArmorDefinition } from '@definitions/armor.definition';
import { StatesStore } from '@stores/states.store';

export class InventoryService {
  private readonly inventoryChanged: Subject<InventoryEvent>;

  private storage: Map<string, { [key: string]: ItemStoredDefinition }>;

  public readonly inventoryChanged$: Observable<InventoryEvent>;

  constructor(statesStore: StatesStore) {
    this.storage = new Map<string, { [key: string]: ItemStoredDefinition }>();

    this.inventoryChanged = new Subject<InventoryEvent>();

    this.inventoryChanged$ = this.inventoryChanged.asObservable();

    for (const key in statesStore.loot) {
      statesStore.loot[key].forEach((item) => {
        this.store(key, item);
      });
    }
  }

  public store(key: string, item: GameItemDefinition): number {
    const quantity = this.putInInventory(key, item);

    this.inventoryChanged.next(new InventoryEvent('STORE', key, item));

    return quantity;
  }

  public take<T extends GameItemDefinition>(
    key: string,
    name: string
  ): T | null {
    const storage = this.getStorage(key);

    const itemStored = storage[name];

    if (itemStored && this.isItemTypeRight(itemStored.item)) {
      const quantity = itemStored.quantity - 1;

      if (quantity) {
        storage[name] = new ItemStoredDefinition(itemStored.item, quantity);
      } else {
        delete storage[name];
      }

      this.inventoryChanged.next(
        new InventoryEvent('TAKE', key, itemStored.item)
      );

      return itemStored.item as T;
    }

    return null;
  }

  public list(key: string): ArrayView<ItemStoredDefinition> {
    const storage = this.getStorage(key);

    const result: ItemStoredDefinition[] = [];

    const a = Object.entries(storage).reduce((acc, [, item]) => {
      acc.push(item);

      return acc;
    }, result);

    return ArrayView.fromArray(a);
  }

  public look<T extends GameItemDefinition>(
    key: string,
    name: string
  ): T | null {
    const itemStored = this.getStorage(key)[name];

    if (itemStored && this.isItemTypeRight(itemStored.item)) {
      return itemStored.item as T;
    }

    return null;
  }

  private getStorage(key: string): {
    [key: string]: ItemStoredDefinition;
  } {
    return this.storage.get(key) ?? {};
  }

  private putInInventory(key: string, item: GameItemDefinition) {
    const storage = this.getStorage(key);

    const itemStored = storage[item.identity.name];

    const quantity = (itemStored?.quantity ?? 0) + 1;

    const itemStorage = new ItemStoredDefinition(item, quantity);

    storage[item.identity.name] = itemStorage;

    this.storage.set(key, storage);

    return quantity;
  }

  private isItemTypeRight(item: GameItemDefinition): boolean {
    return (
      (item.category === 'CONSUMABLE' &&
        item instanceof ConsumableDefinition) ||
      (item.category === 'READABLE' && item instanceof ReadableDefinition) ||
      (item.category === 'USABLE' && item instanceof UsableDefinition) ||
      (item.category === 'WEAPON' && item instanceof WeaponDefinition) ||
      (item.category === 'ARMOR' && item instanceof ArmorDefinition)
    );
  }
}

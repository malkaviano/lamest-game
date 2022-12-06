import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { errorMessages } from '../definitions/error-messages.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ItemStorageDefinition } from '../definitions/item-storage.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { InventoryEvent } from '../events/inventory.event';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly inventoryChanged: Subject<InventoryEvent>;

  private storage: Map<string, { [key: string]: ItemStorageDefinition }>;

  private currentEquipped: WeaponDefinition | null;

  public readonly inventoryChanged$: Observable<InventoryEvent>;

  constructor() {
    this.storage = new Map<string, { [key: string]: ItemStorageDefinition }>();

    this.currentEquipped = null;

    this.inventoryChanged = new Subject<InventoryEvent>();

    this.inventoryChanged$ = this.inventoryChanged.asObservable();
  }

  public get equipped(): WeaponDefinition | null {
    return this.currentEquipped;
  }

  public store(key: string, item: GameItemDefinition): number {
    const storage = this.getStorage(key);

    const itemStored = storage[item.name];

    const quantity = (itemStored?.quantity ?? 0) + 1;

    const itemStorage = new ItemStorageDefinition(item, quantity);

    storage[item.name] = itemStorage;

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
      storage[name] = new ItemStorageDefinition(itemStored.item, quantity);
    } else {
      delete storage[name];
    }

    this.inventoryChanged.next(
      new InventoryEvent('TAKE', key, itemStored.item)
    );

    return itemStored.item;
  }

  public check(key: string): ArrayView<ItemStorageDefinition> {
    const storage = this.getStorage(key);

    const result: ItemStorageDefinition[] = [];

    const a = Object.entries(storage).reduce((acc, [, item]) => {
      acc.push(item);

      return acc;
    }, result);

    return new ArrayView(a);
  }

  public equip(name: string): void {
    const item = this.take('player', name);

    if (item.category !== 'WEAPON') {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    if (this.equipped) {
      this.unequip();
    }

    this.currentEquipped = item as WeaponDefinition;

    this.inventoryChanged.next(new InventoryEvent('EQUIP', 'player', item));
  }

  public unequip(): void {
    if (!this.equipped) {
      throw new Error(errorMessages['INVALID-OPERATION']);
    }

    const item = this.equipped;

    this.store('player', item);

    this.currentEquipped = null;

    this.inventoryChanged.next(new InventoryEvent('UNEQUIP', 'player', item));
  }

  public dispose(): void {
    if (this.equipped?.usability !== 'DISPOSABLE') {
      throw new Error(errorMessages['INVALID-OPERATION']);
    }

    const item = this.equipped;

    this.currentEquipped = null;

    this.inventoryChanged.next(new InventoryEvent('DISPOSE', 'player', item));
  }

  private getStorage(key: string): {
    [key: string]: ItemStorageDefinition;
  } {
    return this.storage.get(key) ?? {};
  }
}

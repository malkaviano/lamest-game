import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../core/definitions/consumable.definition';
import { DamageDefinition } from '../core/definitions/damage.definition';
import { createDice } from '../core/definitions/dice.definition';
import { GameItemDefinition } from '../core/definitions/game-item.definition';
import { KeyValueInterface } from '../core/interfaces/key-value.interface';
import { ConverterHelper } from '../core/helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { UsableDefinition } from '../core/definitions/usable.definition';
import { ItemIdentityDefinition } from '../core/definitions/item-identity.definition';
import { WeaponDefinition } from '../core/definitions/weapon.definition';
import { ReadableDefinition } from '../core/definitions/readable.definition';
import { ArrayView } from '../core/view-models/array.view';

@Injectable({
  providedIn: 'root',
})
export class ItemStore {
  private readonly store: Map<string, GameItemDefinition>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, GameItemDefinition>();

    resourcesStore.weaponStore.weapons.forEach((item) => {
      this.store.set(
        item.name,
        new WeaponDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.skillName,
          new DamageDefinition(
            createDice(item.damage?.dice),
            item.damage.fixed,
            item.damage.effect
          ),
          item.dodgeable,
          item.usability,
          item.energyActivation
        )
      );
    });

    resourcesStore.consumableStore.consumables.forEach((item) => {
      this.store.set(
        item.name,
        new ConsumableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.hp,
          item.energy,
          item.effect,
          item.usability,
          item.skillName
        )
      );
    });

    resourcesStore.usablesStore.usables.forEach((item) => {
      this.store.set(
        item.name,
        new UsableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.usability
        )
      );
    });

    resourcesStore.readableStore.readables.forEach((item) => {
      this.store.set(
        item.name,
        new ReadableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.title,
          ArrayView.create(item.text),
          item.usability
        )
      );
    });
  }

  public get items(): KeyValueInterface<GameItemDefinition> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}

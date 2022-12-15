import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { SkillItemDefinition } from '../definitions/skill-item.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ConverterHelper } from '../helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { UsableItemDefinition } from '../definitions/usable-item.definition';
import { ItemIdentityDefinition } from '../definitions/item-identity.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';

@Injectable({
  providedIn: 'root',
})
export class ItemStore {
  private readonly store: Map<string, GameItemDefinition>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    resourcesStore: ResourcesStore
  ) {
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
          item.usability
        )
      );
    });

    resourcesStore.consumableStore.consumables.forEach((item) => {
      this.store.set(
        item.name,
        new ConsumableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.amount,
          item.effect,
          item.skillName
        )
      );
    });

    resourcesStore.usablesStore.usables.forEach((item) => {
      this.store.set(
        item.name,
        new UsableItemDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description)
        )
      );
    });
  }

  public get items(): KeyValueInterface<GameItemDefinition> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }

  public itemLabel(itemName: string): string {
    return this.items[itemName].identity.label;
  }

  public itemSkill(itemName: string): string | null {
    const item = this.items[itemName];

    return (item as SkillItemDefinition).skillName ?? null;
  }
}

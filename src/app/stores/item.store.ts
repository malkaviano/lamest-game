import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { SkillItemDefinition } from '../definitions/skill-item.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ConverterHelper } from '../helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { UsableItemDefinition } from '../definitions/usable-item.definition';
import { ItemIdentityDefinition } from '../definitions/item-identity.definition';
import { MagazineBehavior } from '../behaviors/magazine.behavior';
import { FirearmValueObject } from '../value-objects/weapons/firearm.vobject';
import { ManualWeaponValueObject } from '../value-objects/weapons/manual-weapon.vobject';

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
      if (item.munition) {
        const behavior = new MagazineBehavior(item.munition.caliber);

        this.store.set(
          item.name,
          new FirearmValueObject(
            new ItemIdentityDefinition(item.name, item.label, item.description),
            item.skillName,
            new DamageDefinition(
              createDice(item.damage?.dice),
              item.damage.fixed
            ),
            item.dodgeable,
            item.usability,
            behavior
          )
        );
      } else {
        this.store.set(
          item.name,
          new ManualWeaponValueObject(
            new ItemIdentityDefinition(item.name, item.label, item.description),
            item.skillName,
            new DamageDefinition(
              createDice(item.damage?.dice),
              item.damage.fixed
            ),
            item.dodgeable,
            item.usability
          )
        );
      }
    });

    resourcesStore.consumableStore.consumables.forEach((item) => {
      this.store.set(
        item.name,
        new ConsumableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.hp,
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

  public itemSkill(itemName: string): SkillNameLiteral | null {
    const item = this.items[itemName];

    return (item as SkillItemDefinition).skillName ?? null;
  }
}

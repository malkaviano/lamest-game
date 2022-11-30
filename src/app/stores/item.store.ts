import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { SkillItemDefinition } from '../definitions/skill-item.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ConverterHelper } from '../helpers/converter.helper';

import weaponStore from '../../assets/weapons.json';
import consumableStore from '../../assets/consumables.json';

@Injectable({
  providedIn: 'root',
})
export class ItemStore {
  private readonly store: Map<string, GameItemDefinition>;

  constructor(private readonly converterHelper: ConverterHelper) {
    this.store = new Map<string, GameItemDefinition>();

    weaponStore.weapons.forEach((item) => {
      this.store.set(
        item.name,
        new WeaponDefinition(
          item.name,
          item.label,
          item.description,
          item.skillName as SkillNameLiteral,
          new DamageDefinition(
            createDice(item.damage?.dice),
            item.damage.fixed
          ),
          item.dodgeable
        )
      );
    });

    consumableStore.consumables.forEach((item) => {
      this.store.set(
        item.name,
        new ConsumableDefinition(
          item.name,
          item.label,
          item.description,
          item.hp,
          item.skillName as SkillNameLiteral
        )
      );
    });
  }

  public get items(): KeyValueInterface<GameItemDefinition> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }

  public itemLabel(itemName: string): string {
    return this.items[itemName].label;
  }

  public itemSkill(itemName: string): SkillNameLiteral | null {
    const item = this.items[itemName];

    return (item as SkillItemDefinition).skillName ?? null;
  }
}

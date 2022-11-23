import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { SkillItemDefinition } from '../definitions/skill-item.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';

@Injectable({
  providedIn: 'root',
})
export class ItemStore {
  public readonly items: KeyValueInterface<GameItemDefinition>;

  constructor() {
    this.items = {
      knife: new WeaponDefinition(
        'knife',
        'Hunting Knife',
        'A knife used by hunters mostly',
        'Melee Weapon (Simple)'
      ),
      halberd: new WeaponDefinition(
        'halberd',
        'Halberd',
        'A big weapon',
        'Melee Weapon (Great)'
      ),
      firstAid: new ConsumableDefinition(
        'firstAid',
        'First Aid Kit',
        'Use to recover HP'
      ),
    };
  }

  public itemSkill(itemName: string): SkillNameLiteral | null {
    const item = this.items[itemName];

    if (item.hasOwnProperty('skillName')) {
      return (item as SkillItemDefinition).skillName;
    }

    return null;
  }
}

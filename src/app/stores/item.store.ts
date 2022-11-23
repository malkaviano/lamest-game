import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';

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
      firstAid: new ConsumableDefinition(
        'firstAid',
        'First Aid Kit',
        'Use to recover HP'
      ),
    };
  }
}

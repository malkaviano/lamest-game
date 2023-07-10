import { EffectDefinition } from '@definitions/effect.definition';
import { createDice } from '@definitions/dice.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { GameStringsStore } from '@stores/game-strings.store';

export const unarmedWeapon = new WeaponDefinition(
  new ItemIdentityDefinition(
    'unarmed',
    'Unarmed',
    GameStringsStore.descriptions['UNARMED']
  ),
  'Brawl',
  new EffectDefinition(createDice({ D4: 1 }), 0, 'KINETIC'),
  true,
  'PERMANENT',
  0
);

export class EquipmentBehavior {
  private weapon: WeaponDefinition | null;

  private constructor() {
    this.weapon = null;
  }

  public get weaponEquipped(): WeaponDefinition {
    return this.weapon ?? unarmedWeapon;
  }

  public equip(weapon: WeaponDefinition): WeaponDefinition | null {
    const previous = this.weapon;

    this.weapon = weapon;

    return previous;
  }

  public unEquip(): WeaponDefinition | null {
    const previous = this.weapon;

    this.weapon = null;

    return previous;
  }

  public static create(): EquipmentBehavior {
    return new EquipmentBehavior();
  }
}

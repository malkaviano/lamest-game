import { WeaponDefinition } from '../definitions/weapon.definition';
import { unarmedWeapon } from '../value-objects/weapons/manual-weapon.vobject';

export class EquipmentBehavior {
  private weapon: WeaponDefinition | null;

  constructor() {
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
}

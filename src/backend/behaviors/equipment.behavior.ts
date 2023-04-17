import {
  unarmedWeapon,
  WeaponDefinition,
} from '../definitions/weapon.definition';

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

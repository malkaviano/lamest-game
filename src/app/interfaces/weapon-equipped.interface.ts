import { WeaponDefinition } from '../definitions/weapon.definition';

export interface WeaponEquipped {
  get weaponEquipped(): WeaponDefinition;

  equip(weapon: WeaponDefinition): WeaponDefinition | null;

  unEquip(): WeaponDefinition | null;
}

import { EffectDefinition } from '@definitions/effect.definition';
import { createDice } from '@definitions/dice.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { GameStringsStore } from '@stores/game-strings.store';
import { ArmorDefinition } from '@definitions/armor.definition';
import { createDamageReduction } from '@definitions/damage-reduction.definition';
import { SettingsStore } from '../stores/settings.store';

const unarmedSettings = SettingsStore.settings.unarmedDamage;

export const unarmedWeapon = new WeaponDefinition(
  new ItemIdentityDefinition(
    'unarmed',
    'Unarmed',
    GameStringsStore.descriptions['UNARMED']
  ),
  'Brawl',
  new EffectDefinition(
    createDice(unarmedSettings.dice),
    unarmedSettings.fixed,
    unarmedSettings.effect
  ),
  true,
  'PERMANENT',
  0,
  'COMMON'
);

export const clothArmor = new ArmorDefinition(
  new ItemIdentityDefinition(
    'clothes',
    'Clothes',
    GameStringsStore.descriptions['CLOTHES']
  ),
  'PERMANENT',
  createDamageReduction(),
  'MINIMAL'
);

export class EquipmentBehavior {
  private weapon: WeaponDefinition | null;

  private armor: ArmorDefinition | null;

  private constructor() {
    this.weapon = null;

    this.armor = null;
  }

  public get weaponEquipped(): WeaponDefinition {
    return this.weapon ?? unarmedWeapon;
  }

  public get armorWearing(): ArmorDefinition {
    return this.armor ?? clothArmor;
  }

  public changeWeapon(weapon?: WeaponDefinition): WeaponDefinition | null {
    const previous = this.weapon;

    this.weapon = weapon ?? null;

    return previous;
  }

  public changeArmor(armor?: ArmorDefinition): ArmorDefinition | null {
    const previous = this.armor;

    this.armor = armor ?? null;

    return previous;
  }

  public static create(): EquipmentBehavior {
    return new EquipmentBehavior();
  }
}

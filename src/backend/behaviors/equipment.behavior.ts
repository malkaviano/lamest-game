import { EffectDefinition } from '@definitions/effect.definition';
import { createDice } from '@definitions/dice.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { GameStringsStore } from '@stores/game-strings.store';
import { ArmorDefinition } from '@definitions/armor.definition';

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
  0,
  'COMMON'
);

export const clothesArmor = new ArmorDefinition(
  new ItemIdentityDefinition(
    'clothes',
    'Clothes',
    GameStringsStore.descriptions['CLOTHES']
  ),
  'PERMANENT',
  {
    ACID: 0,
    FIRE: 0,
    KINETIC: 0,
    PROFANE: 0,
    SACRED: 0,
  },
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
    return this.armor ?? clothesArmor;
  }

  public equip(weapon: WeaponDefinition): WeaponDefinition | null {
    const previous = this.unEquip();

    this.weapon = weapon;

    return previous;
  }

  public unEquip(): WeaponDefinition | null {
    const previous = this.weapon;

    this.weapon = null;

    return previous;
  }

  public wear(armor: ArmorDefinition): ArmorDefinition | null {
    const previous = this.strip();

    this.armor = armor;

    return previous;
  }

  public strip(): ArmorDefinition | null {
    const previous = this.armor;

    this.armor = null;

    return previous;
  }

  public static create(): EquipmentBehavior {
    return new EquipmentBehavior();
  }
}

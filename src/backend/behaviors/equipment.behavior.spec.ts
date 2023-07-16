import {
  EquipmentBehavior,
  clothesArmor,
  unarmedWeapon,
} from '@behaviors/equipment.behavior';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ArmorDefinition } from '@definitions/armor.definition';

import {
  kevlarVest,
  leatherJacket,
  molotov,
  simpleSword,
} from '../../../tests/fakes';

describe('EquipmentBehavior', () => {
  describe('weaponEquipped', () => {
    it('return equipped weapon', () => {
      const char = fakeBehavior();

      const equipped = [];

      equipped.push(char.weaponEquipped);

      equipBehavior(char, simpleSword);

      equipped.push(char.weaponEquipped);

      equipBehavior(char, molotov);

      equipped.push(char.weaponEquipped);

      expect(equipped).toEqual([unarmedWeapon, simpleSword, molotov]);
    });
  });

  describe('equip', () => {
    it('return previous weapon', () => {
      const char = fakeBehavior();

      const weapons = [];

      weapons.push(equipBehavior(char, simpleSword));

      weapons.push(equipBehavior(char, molotov));

      expect(weapons).toEqual([null, simpleSword]);
    });
  });

  describe('unEquip', () => {
    it('return previous weapon', () => {
      const char = fakeBehavior();

      const weapons = [];

      weapons.push(unEquipBehavior(char));

      equipBehavior(char, simpleSword);

      weapons.push(unEquipBehavior(char));

      expect(weapons).toEqual([null, simpleSword]);
    });
  });

  describe('armorWearing', () => {
    it('return wearing armor', () => {
      const char = fakeBehavior();

      const armor = [];

      armor.push(char.armorWearing);

      wearBehavior(char, leatherJacket);

      armor.push(char.armorWearing);

      wearBehavior(char, kevlarVest);

      armor.push(char.armorWearing);

      expect(armor).toEqual([clothesArmor, leatherJacket, kevlarVest]);
    });
  });

  describe('wear', () => {
    it('return previous armor', () => {
      const char = fakeBehavior();

      const armor = [];

      armor.push(wearBehavior(char, leatherJacket));

      armor.push(wearBehavior(char, kevlarVest));

      expect(armor).toEqual([null, leatherJacket]);
    });
  });

  describe('strip', () => {
    it('return previous armor', () => {
      const char = fakeBehavior();

      const armor = [];

      armor.push(stripBehavior(char));

      wearBehavior(char, leatherJacket);

      armor.push(stripBehavior(char));

      expect(armor).toEqual([null, leatherJacket]);
    });
  });
});

const fakeBehavior = () => EquipmentBehavior.create();

const equipBehavior = (
  character: EquipmentBehavior,
  weapon: WeaponDefinition
): WeaponDefinition | null => {
  const previous = character.equip(weapon);

  return previous;
};

const unEquipBehavior = (
  character: EquipmentBehavior
): WeaponDefinition | null => {
  return character.unEquip();
};

const wearBehavior = (
  character: EquipmentBehavior,
  armor: ArmorDefinition
): ArmorDefinition | null => {
  const previous = character.wear(armor);

  return previous;
};

const stripBehavior = (
  character: EquipmentBehavior
): ArmorDefinition | null => {
  return character.strip();
};

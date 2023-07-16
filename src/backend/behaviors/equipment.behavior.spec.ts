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

  describe('changeWeapon', () => {
    it('return previous weapon', () => {
      const char = fakeBehavior();

      const weapons = [];

      weapons.push(equipBehavior(char, simpleSword));

      weapons.push(equipBehavior(char, molotov));

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

  describe('changeArmor', () => {
    it('return previous armor', () => {
      const char = fakeBehavior();

      const armor = [];

      armor.push(wearBehavior(char, leatherJacket));

      armor.push(wearBehavior(char, kevlarVest));

      expect(armor).toEqual([null, leatherJacket]);
    });
  });
});

const fakeBehavior = () => EquipmentBehavior.create();

const equipBehavior = (
  character: EquipmentBehavior,
  weapon: WeaponDefinition
): WeaponDefinition | null => {
  const previous = character.changeWeapon(weapon);

  return previous;
};

const wearBehavior = (
  character: EquipmentBehavior,
  armor: ArmorDefinition
): ArmorDefinition | null => {
  const previous = character.changeArmor(armor);

  return previous;
};

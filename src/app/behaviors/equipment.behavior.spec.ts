import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import {
  unarmedWeapon,
  WeaponDefinition,
} from '../definitions/weapon.definition';
import { EquipmentBehavior } from './equipment.behavior';

describe('EquipmentBehavior', () => {
  describe('weaponEquipped', () => {
    describe('when created', () => {
      it('return unarmed weapon', () => {
        expect(behavior().weaponEquipped).toEqual(unarmedWeapon);
      });
    });

    describe('when equipping a weapon', () => {
      describe('when no weapon was equipped', () => {
        it('should equip the weapon', () => {
          const char = behavior();

          equipBehavior(char, weapon1);

          expect(char.weaponEquipped).toEqual(weapon1);
        });
      });

      describe('when weapon was equipped', () => {
        it('should equip the weapon', () => {
          const char = behavior();

          equipBehavior(char, weapon1);

          equipBehavior(char, weapon2);

          expect(char.weaponEquipped).toEqual(weapon2);
        });
      });
    });
  });

  describe('equip', () => {
    describe('when no weapon was equipped', () => {
      it('return null', () => {
        const char = behavior();

        const weapon = equipBehavior(char, weapon1);

        expect(weapon).toBeNull();
      });
    });

    describe('when weapon was equipped', () => {
      it('return previous weapon', () => {
        const char = behavior();

        equipBehavior(char, weapon1);

        const weapon = equipBehavior(char, weapon2);

        expect(weapon).toEqual(weapon1);
      });
    });
  });

  describe('unEquip', () => {
    describe('when no weapon was equipped', () => {
      it('return null', () => {
        const char = behavior();

        const weapon = unEquipBehavior(char);

        expect(weapon).toBeNull();
      });
    });

    describe('when weapon was equipped', () => {
      it('return previous weapon', () => {
        const char = behavior();

        equipBehavior(char, weapon1);

        const weapon = unEquipBehavior(char);

        expect(weapon).toEqual(weapon1);
      });
    });
  });
});

const behavior = () => new EquipmentBehavior();

const equipBehavior = (
  character: EquipmentBehavior,
  weapon: WeaponDefinition
): WeaponDefinition | null => {
  const previous = character.equip(weapon);

  return previous;
};

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

const weapon2 = new WeaponDefinition(
  'sword2',
  'Decent Sword',
  'A good sword, not exceptional',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

const unEquipBehavior = (
  character: EquipmentBehavior
): WeaponDefinition | null => {
  return character.unEquip();
};

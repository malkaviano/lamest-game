import { EquipmentBehavior, unarmedWeapon } from './equipment.behavior';
import { WeaponDefinition } from '../definitions/weapon.definition';

import { molotov, simpleSword } from '../../../tests/fakes';

describe('EquipmentBehavior', () => {
  describe('weaponEquipped', () => {
    describe('when created', () => {
      it('return unarmed weapon', () => {
        expect(fakeBehavior().weaponEquipped).toEqual(unarmedWeapon);
      });
    });

    describe('when equipping a weapon', () => {
      describe('when no weapon was equipped', () => {
        it('should equip the weapon', () => {
          const char = fakeBehavior();

          equipBehavior(char, simpleSword);

          expect(char.weaponEquipped).toEqual(simpleSword);
        });
      });

      describe('when weapon was equipped', () => {
        it('should equip the weapon', () => {
          const char = fakeBehavior();

          equipBehavior(char, simpleSword);

          equipBehavior(char, molotov);

          expect(char.weaponEquipped).toEqual(molotov);
        });
      });
    });
  });

  describe('equip', () => {
    describe('when no weapon was equipped', () => {
      it('return null', () => {
        const char = fakeBehavior();

        const weapon = equipBehavior(char, simpleSword);

        expect(weapon).toBeNull();
      });
    });

    describe('when weapon was equipped', () => {
      it('return previous weapon', () => {
        const char = fakeBehavior();

        equipBehavior(char, simpleSword);

        const weapon = equipBehavior(char, molotov);

        expect(weapon).toEqual(simpleSword);
      });
    });
  });

  describe('unEquip', () => {
    describe('when no weapon was equipped', () => {
      it('return null', () => {
        const char = fakeBehavior();

        const weapon = unEquipBehavior(char);

        expect(weapon).toBeNull();
      });
    });

    describe('when weapon was equipped', () => {
      it('return previous weapon', () => {
        const char = fakeBehavior();

        equipBehavior(char, simpleSword);

        const weapon = unEquipBehavior(char);

        expect(weapon).toEqual(simpleSword);
      });
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

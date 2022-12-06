import { take } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacterEntity } from './character.entity';
import { HitPointsEvent } from '../events/hitpoints.event';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { createActionableDefinition } from '../definitions/actionable.definition';
import {
  createDamagedMessage,
  createHealedMessage,
} from '../definitions/log-message.definition';
import { ResultLiteral } from '../literals/result.literal';
import {
  unarmedWeapon,
  WeaponDefinition,
} from '../definitions/weapon.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';

describe('CharacterEntity', () => {
  describe('derivedAttributes', () => {
    it('return HP 9, PP 13, MOV 10', () => {
      expect(character().derivedAttributes).toEqual(expectedDerivedAttributes);
    });
  });

  describe('skill', () => {
    it('return Appraise 12 and Dodge 32', () => {
      expect(character().skills).toEqual(expectedSkills);
    });
  });

  describe('characteristics', () => {
    it('return characteristics', () => {
      expect(character().characteristics).toEqual(fakeCharacteristics);
    });
  });

  describe('reactTo', () => {
    describe('when damage taken', () => {
      describe('attack was SUCCESS', () => {
        it('return damage taken', () => {
          when(mockedActorBehavior.damaged(10)).thenReturn(
            new HitPointsEvent(9, 0)
          );

          const result = character().reactTo(attackAction, 'SUCCESS', 10);

          expect(result).toEqual(logAttacked);
        });

        it('should emit an event', (done) => {
          let result: HitPointsEvent | undefined;

          when(mockedActorBehavior.damaged(6)).thenReturn(
            new HitPointsEvent(9, 3)
          );

          const char = character();

          char.hpChanged$.pipe(take(10)).subscribe((event) => {
            result = event;
          });

          char.reactTo(attackAction, 'SUCCESS', 6);

          done();

          expect(result).toEqual(new HitPointsEvent(9, 3));
        });
      });

      ['FAILURE', 'NONE', 'IMPOSSIBLE'].forEach((result) => {
        describe(`attack was ${result}`, () => {
          it('return nothing', () => {
            const log = character().reactTo(
              attackAction,
              result as ResultLiteral,
              1
            );

            expect(log).not.toBeDefined();
          });
        });
      });
    });

    describe('when heal received', () => {
      ['SUCCESS', 'NONE'].forEach((result) => {
        describe(`heal was ${result}`, () => {
          it('return heal received', () => {
            when(mockedActorBehavior.healed(10)).thenReturn(
              new HitPointsEvent(4, 9)
            );

            const log = character().reactTo(
              healAction,
              result as ResultLiteral,
              10
            );

            expect(log).toEqual(logHealed);
          });
        });

        it('should emit an event', (done) => {
          let hpResult: HitPointsEvent | undefined;

          when(mockedActorBehavior.healed(5)).thenReturn(
            new HitPointsEvent(6, 9)
          );

          const char = character();

          char.hpChanged$.pipe(take(10)).subscribe((event) => {
            hpResult = event;
          });

          char.reactTo(healAction, result as ResultLiteral, 5);

          done();

          expect(hpResult).toEqual(new HitPointsEvent(6, 9));
        });
      });

      ['IMPOSSIBLE', 'FAILURE'].forEach((result) => {
        describe(`heal was ${result}`, () => {
          it('return nothing', () => {
            const log = character().reactTo(
              healAction,
              result as ResultLiteral,
              1
            );

            expect(log).not.toBeDefined();
          });
        });
      });
    });
  });

  describe('weaponEquipped', () => {
    it('return current weapon', () => {
      when(mockedEquipmentBehavior.weaponEquipped).thenReturn(unarmedWeapon);

      expect(character().weaponEquipped).toEqual(unarmedWeapon);
    });
  });

  describe('equip', () => {
    it('should equip new weapon', () => {
      when(mockedEquipmentBehavior.weaponEquipped).thenReturn(weapon1);

      const char = character();

      equipCharacter(char, weapon1);

      expect(char.weaponEquipped).toEqual(weapon1);
    });

    it('should emit event', (done) => {
      let result: WeaponDefinition | undefined;

      const char = character();

      char.weaponEquippedChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      equipCharacter(char, weapon1);

      done();

      expect(result).toEqual(weapon1);
    });
  });

  describe('unEquip', () => {
    it('should un-equip current weapon', () => {
      when(mockedEquipmentBehavior.unEquip()).thenReturn(weapon1);

      const char = character();

      const result = unEquipCharacter(char);

      expect(result).toEqual(weapon1);
    });

    it('should emit event', (done) => {
      when(mockedEquipmentBehavior.unEquip()).thenReturn(weapon1);

      let result: WeaponDefinition | undefined;

      const char = character();

      char.weaponEquippedChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      unEquipCharacter(char);

      done();

      expect(result).toEqual(weapon1);
    });
  });
});

const fakeIdentity = new IdentityDefinition(
  'Some Name',
  'Police Detective',
  'YOUNG',
  'HUMAN',
  'SHORT',
  'LIGHT'
);

const fakeCharacteristics = {
  STR: new CharacteristicDefinition('STR', 8),
  CON: new CharacteristicDefinition('CON', 9),
  SIZ: new CharacteristicDefinition('SIZ', 10),
  DEX: new CharacteristicDefinition('DEX', 11),
  INT: new CharacteristicDefinition('INT', 12),
  POW: new CharacteristicDefinition('POW', 13),
  APP: new CharacteristicDefinition('APP', 14),
};

const expectedDerivedAttributes: DerivedAttributeSetDefinition = {
  HP: new DerivedAttributeDefinition('HP', 9),
  PP: new DerivedAttributeDefinition('PP', 13),
  MOV: new DerivedAttributeDefinition('MOV', 10),
};

const mockedActorBehavior = mock(ActorBehavior);

const mockedEquipmentBehavior = mock(EquipmentBehavior);

const character = () =>
  new CharacterEntity(
    fakeIdentity,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior)
  );

const expectedSkills = {
  Appraise: 12,
  Dodge: 32,
};

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const healAction = createActionableDefinition('HEAL', 'heal', 'Heal');

const logAttacked = createDamagedMessage(9);

const logHealed = createHealedMessage(5);

when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

when(mockedActorBehavior.skills).thenReturn(expectedSkills);

when(mockedActorBehavior.derivedAttributes).thenReturn(
  expectedDerivedAttributes
);

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

when(mockedEquipmentBehavior.equip(weapon1)).thenReturn(null);

const equipCharacter = (
  character: CharacterEntity,
  weapon: WeaponDefinition
): WeaponDefinition | null => {
  const previous = character.equip(weapon);

  return previous;
};

const unEquipCharacter = (
  character: CharacterEntity
): WeaponDefinition | null => {
  return character.unEquip();
};

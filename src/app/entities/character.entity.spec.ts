import { take } from 'rxjs';

import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { CharacterEntity } from './character.entity';
import { HitPointsEvent } from '../events/hitpoints.event';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';

describe('CharacterEntity', () => {
  describe('Calculating Derived Attributes', () => {
    it('return HP 9, PP 13, MOV 10', () => {
      expect(character().derivedAttributes).toEqual(expectedDerivedAttributes);
    });
  });

  describe('Applying characteristic value to related skill', () => {
    it('return Appraise 12 and Dodge 32', () => {
      expect(character().skills).toEqual(expectedSkills);
    });
  });

  describe('Copying entity', () => {
    describe('when making an identical copy', () => {
      it('return equal entity', () => {
        const copied = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          fakeSkills
        );

        expect(character().copy()).toEqual(copied);
      });
    });

    describe('when making a copy with different identity', () => {
      it('return entity with new identity', () => {
        const identity = new IdentityDefinition(
          'Some Name',
          'Police Detective',
          'VETERAN',
          'HUMAN',
          'TALL',
          'LIGHT'
        );

        const copied = new CharacterEntity(
          identity,
          fakeCharacteristics,
          fakeSkills
        );

        expect(character().copy({ identity })).toEqual(copied);
      });
    });

    describe('when making a copy with different characteristics', () => {
      it('return entity with new characteristics', () => {
        const characteristics = {
          STR: new CharacteristicDefinition('STR', 11),
          CON: new CharacteristicDefinition('CON', 11),
          SIZ: new CharacteristicDefinition('SIZ', 11),
          DEX: new CharacteristicDefinition('DEX', 11),
          INT: new CharacteristicDefinition('INT', 11),
          POW: new CharacteristicDefinition('POW', 11),
          APP: new CharacteristicDefinition('APP', 11),
        };
        const copied = new CharacterEntity(
          fakeIdentity,
          characteristics,
          fakeSkills
        );

        expect(character().copy({ characteristics })).toEqual(copied);
      });
    });

    describe('when making a copy with different skills', () => {
      it('return entity with new skills', () => {
        const skills = new Map<SkillNameLiteral, number>([
          ['Artillery (War)', 0],
          ['Dodge', 10],
          ['Athleticism', 10],
        ]);

        const copied = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          skills
        );

        expect(character().copy({ skills })).toEqual(copied);
      });
    });
  });

  describe('All skills', () => {
    it('return all skills with characteristics applied', () => {
      const result = character().skills;

      expect(result).toEqual({
        Appraise: 12,
        Dodge: 32,
      });
    });
  });

  describe('taking damage', () => {
    describe('when damage is equal or higher than HP', () => {
      it('return 9', () => {
        const result = character().damaged(12);

        expect(result).toEqual(9);
      });

      it('return HP = 0', () => {
        const char = character();

        char.damaged(12);

        expect(char.derivedAttributes['HP'].value).toEqual(0);
      });
    });

    describe('when damage is lesser than HP', () => {
      it('return 6', () => {
        const result = character().damaged(6);

        expect(result).toEqual(6);
      });

      it('return HP = 3', () => {
        const char = character();

        char.damaged(6);

        expect(char.derivedAttributes['HP'].value).toEqual(3);
      });
    });

    it('should emit an event', (done) => {
      let result: HitPointsEvent | undefined;

      const char = character();

      char.hpChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      char.damaged(6);

      done();

      expect(result).toEqual(new HitPointsEvent(9, 3));
    });
  });

  describe('healing player', () => {
    describe('when heal received goes over maximum HP', () => {
      it('return 2', () => {
        const char = character();

        char.damaged(2);

        const result = char.healed(4);

        expect(result).toEqual(2);
      });

      it('return HP equal maximum HP', () => {
        const char = character();

        char.damaged(2);

        char.healed(4);

        expect(char.derivedAttributes['HP'].value).toEqual(9);
      });
    });

    it('should emit an event', (done) => {
      let result: HitPointsEvent | undefined;

      const char = character();

      char.hpChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      char.damaged(3);

      char.healed(5);

      done();

      expect(result).toEqual(new HitPointsEvent(6, 9));
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

const fakeSkills = new Map<SkillNameLiteral, number>([
  ['Appraise', 0],
  ['Dodge', 10],
]);

const expectedDerivedAttributes: DerivedAttributeSetDefinition = {
  HP: new DerivedAttributeDefinition('HP', 9),
  PP: new DerivedAttributeDefinition('PP', 13),
  MOV: new DerivedAttributeDefinition('MOV', 10),
};

const character = () =>
  new CharacterEntity(fakeIdentity, fakeCharacteristics, fakeSkills);

const expectedSkills = {
  Appraise: 12,
  Dodge: 32,
};

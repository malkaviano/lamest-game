import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { CharacterEntity } from './character.entity';

describe('CharacterEntity', () => {
  describe('Calculating Derived Attributes', () => {
    it('return HP 9, PP 13, MOV 10', () => {
      const character = new CharacterEntity(
        fakeIdentity,
        fakeCharacteristics,
        fakeSkills
      );

      expect(character.derivedAttributes).toEqual(expectedDerivedAttributes);
    });
  });

  describe('Applying characteristic value to related skill', () => {
    it('return Appraise 12 and Dodge 32', () => {
      const character = new CharacterEntity(
        fakeIdentity,
        fakeCharacteristics,
        fakeSkills
      );

      expect(character.skills).toEqual(expectedSkills);
    });
  });

  describe('Copying entity', () => {
    describe('when making an identical copy', () => {
      it('return equal entity', () => {
        const character = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          fakeSkills
        );

        const copied = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          fakeSkills
        );

        expect(character.copy()).toEqual(copied);
      });
    });

    describe('when making a copy with different identity', () => {
      it('return entity with new identity', () => {
        const character = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          fakeSkills
        );

        const identity = new CharacterIdentityDefinition(
          'Some Name',
          'Police Detective',
          'FEMALE',
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

        expect(character.copy({ identity })).toEqual(copied);
      });
    });

    describe('when making a copy with different characteristics', () => {
      it('return entity with new characteristics', () => {
        const character = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          fakeSkills
        );

        const characteristics = new CharacteristicsDefinition(
          new CharacteristicDefinition('STR', 11),
          new CharacteristicDefinition('CON', 11),
          new CharacteristicDefinition('SIZ', 11),
          new CharacteristicDefinition('DEX', 11),
          new CharacteristicDefinition('INT', 11),
          new CharacteristicDefinition('POW', 11),
          new CharacteristicDefinition('APP', 11)
        );

        const copied = new CharacterEntity(
          fakeIdentity,
          characteristics,
          fakeSkills
        );

        expect(character.copy({ characteristics })).toEqual(copied);
      });
    });

    describe('when making a copy with different skills', () => {
      it('return entity with new skills', () => {
        const character = new CharacterEntity(
          fakeIdentity,
          fakeCharacteristics,
          fakeSkills
        );

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

        expect(character.copy({ skills })).toEqual(copied);
      });
    });
  });
});

const fakeIdentity = new CharacterIdentityDefinition(
  'Some Name',
  'Police Detective',
  'MALE',
  'YOUNG',
  'HUMAN',
  'SHORT',
  'LIGHT'
);

const fakeCharacteristics = new CharacteristicsDefinition(
  new CharacteristicDefinition('STR', 8),
  new CharacteristicDefinition('CON', 9),
  new CharacteristicDefinition('SIZ', 10),
  new CharacteristicDefinition('DEX', 11),
  new CharacteristicDefinition('INT', 12),
  new CharacteristicDefinition('POW', 13),
  new CharacteristicDefinition('APP', 14)
);

const fakeSkills = new Map<SkillNameLiteral, number>([
  ['Appraise', 0],
  ['Dodge', 10],
]);

const expectedDerivedAttributes = new DerivedAttributesDefinition(
  new DerivedAttributeDefinition('HP', 9),
  new DerivedAttributeDefinition('PP', 13),
  new DerivedAttributeDefinition('MOV', 10)
);

const expectedSkills = {
  Appraise: 12,
  Dodge: 32,
};

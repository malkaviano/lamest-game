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

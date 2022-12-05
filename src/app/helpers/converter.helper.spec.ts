import { instance, mock, when } from 'ts-mockito';

import { ArrayView } from '../views/array.view';
import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacterValuesDefinition } from '../definitions/character-values.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { KeyValueDescriptionDefinition } from '../definitions/key-value-description.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ConverterHelper } from './converter.helper';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';

describe('ConverterHelper', () => {
  describe('converting a character to keyValues', () => {
    it('return keyvalue array', () => {
      when(mockedCharacterEntity.identity).thenReturn(identity);

      when(mockedCharacterEntity.characteristics).thenReturn(characteristics);

      when(mockedCharacterEntity.derivedAttributes).thenReturn(
        derivedAttributes
      );

      when(mockedCharacterEntity.skills).thenReturn(skills);

      const result = helper.characterToKeyValueDescription(
        instance(mockedCharacterEntity)
      );

      expect(result).toEqual(expected);
    });
  });

  describe('mapToKeyValueInterface', () => {
    it('return KeyValueInterface', () => {
      const map = new Map<string, number>();

      map.set('gg', 12);
      map.set('xpto', 100);

      const result = helper.mapToKeyValueInterface(map);

      expect(result).toEqual({
        gg: 12,
        xpto: 100,
      });
    });
  });
});

const helper = new ConverterHelper();

const identity = new IdentityDefinition(
  'name',
  'Hunter',
  'ADULT',
  'HUMAN',
  'AVERAGE',
  'AVERAGE'
);

const characteristics = {
  STR: new CharacteristicDefinition('STR', 12),
  CON: new CharacteristicDefinition('CON', 12),
  SIZ: new CharacteristicDefinition('SIZ', 12),
  DEX: new CharacteristicDefinition('DEX', 12),
  INT: new CharacteristicDefinition('INT', 12),
  POW: new CharacteristicDefinition('POW', 12),
  APP: new CharacteristicDefinition('APP', 12),
};

const derivedAttributes = {
  HP: new DerivedAttributeDefinition('HP', 12),
  PP: new DerivedAttributeDefinition('PP', 12),
  MOV: new DerivedAttributeDefinition('MOV', 10),
};

const skills = {
  'Firearm (Handgun)': 62,
  'First Aid': 47,
  Listen: 32,
  Persuade: 72,
  Spot: 52,
  Research: 47,
};

const expected = new CharacterValuesDefinition(
  new ArrayView([
    new KeyValueDescriptionDefinition('NAME', 'name', 'Character name'),
    new KeyValueDescriptionDefinition(
      'PROFESSION',
      'Hunter',
      'Character profession'
    ),
    new KeyValueDescriptionDefinition('AGE', 'ADULT', 'Character age'),
    new KeyValueDescriptionDefinition('RACE', 'HUMAN', 'Character race'),
    new KeyValueDescriptionDefinition('HEIGHT', 'AVERAGE', 'Character height'),
    new KeyValueDescriptionDefinition('WEIGHT', 'AVERAGE', 'Character weight'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition(
      'STR',
      '12',
      'The character physical force'
    ),
    new KeyValueDescriptionDefinition(
      'CON',
      '12',
      'The character body constitution'
    ),
    new KeyValueDescriptionDefinition('SIZ', '12', 'The character body shape'),
    new KeyValueDescriptionDefinition('DEX', '12', 'The character agility'),
    new KeyValueDescriptionDefinition(
      'INT',
      '12',
      'The character intelligence'
    ),
    new KeyValueDescriptionDefinition(
      'POW',
      '12',
      'The character mental strength'
    ),
    new KeyValueDescriptionDefinition('APP', '12', 'The character looks'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('HP', '12', 'The character hit points'),
    new KeyValueDescriptionDefinition('PP', '12', 'The character power points'),
    new KeyValueDescriptionDefinition('MOV', '10', 'The character movement'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('Firearm (Handgun)', '62', ''),
    new KeyValueDescriptionDefinition('First Aid', '47', ''),
    new KeyValueDescriptionDefinition('Listen', '32', ''),
    new KeyValueDescriptionDefinition('Persuade', '72', ''),
    new KeyValueDescriptionDefinition('Research', '47', ''),
    new KeyValueDescriptionDefinition('Spot', '52', ''),
  ])
);

const mockedCharacterEntity = mock(CharacterEntity);

import { instance, mock, when } from 'ts-mockito';

import { ArrayView } from '../views/array.view';
import { CharacterValuesDefinition } from '../definitions/character-values.definition';
import { KeyValueDescriptionDefinition } from '../definitions/key-value-description.definition';
import { PlayerEntity } from '../entities/player.entity';
import { ConverterHelper } from './converter.helper';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeIdentity,
} from '../../../tests/fakes';

describe('ConverterHelper', () => {
  describe('converting a character to keyValues', () => {
    it('return keyvalue array', () => {
      when(mockedPlayerEntity.identity).thenReturn(fakeIdentity);

      when(mockedPlayerEntity.characteristics).thenReturn(fakeCharacteristics);

      when(mockedPlayerEntity.derivedAttributes).thenReturn(
        fakeDerivedAttributes
      );

      when(mockedPlayerEntity.skills).thenReturn(skills);

      const result = helper.characterToKeyValueDescription(
        instance(mockedPlayerEntity)
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
    new KeyValueDescriptionDefinition('NAME', 'Some Name', 'Character name'),
    new KeyValueDescriptionDefinition(
      'PROFESSION',
      'Police Detective',
      'Character profession'
    ),
    new KeyValueDescriptionDefinition('AGE', 'YOUNG', 'Character age'),
    new KeyValueDescriptionDefinition('RACE', 'HUMAN', 'Character race'),
    new KeyValueDescriptionDefinition('HEIGHT', 'SHORT', 'Character height'),
    new KeyValueDescriptionDefinition('WEIGHT', 'LIGHT', 'Character weight'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition(
      'STR',
      '8',
      'The character physical force'
    ),
    new KeyValueDescriptionDefinition('VIT', '9', 'The character vitality'),
    new KeyValueDescriptionDefinition('AGI', '11', 'The character agility'),
    new KeyValueDescriptionDefinition(
      'INT',
      '12',
      'The character intelligence'
    ),
    new KeyValueDescriptionDefinition(
      'POW',
      '13',
      'The character mental strength'
    ),
    new KeyValueDescriptionDefinition('APP', '14', 'The character looks'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('HP', '8', 'The character hit points'),
    new KeyValueDescriptionDefinition('PP', '13', 'The character power points'),
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

const mockedPlayerEntity = mock(PlayerEntity);

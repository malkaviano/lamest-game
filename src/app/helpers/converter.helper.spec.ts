import { instance, when } from 'ts-mockito';

import { ConverterHelper } from './converter.helper';

import {
  fakeCharacteristics,
  fakeCharacterSheet,
  fakeDerivedAttributes,
  fakeIdentity,
  fakeSkills,
} from '../../../tests/fakes';

import { mockedPlayerEntity } from '../../../tests/mocks';

describe('ConverterHelper', () => {
  describe('converting a character to keyValues', () => {
    it('return keyvalue array', () => {
      when(mockedPlayerEntity.identity).thenReturn(fakeIdentity);

      when(mockedPlayerEntity.characteristics).thenReturn(fakeCharacteristics);

      when(mockedPlayerEntity.derivedAttributes).thenReturn(
        fakeDerivedAttributes
      );

      when(mockedPlayerEntity.skills).thenReturn(fakeSkills);

      const result = helper.characterToKeyValueDescription(
        instance(mockedPlayerEntity)
      );

      expect(result).toEqual(fakeCharacterSheet);
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

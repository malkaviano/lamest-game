import { anyNumber, instance, when } from 'ts-mockito';

import { CharacterIdentityDefinition } from '../../core/definitions/character-identity.definition';
import { CharacteristicDefinition } from '../../core/definitions/characteristic.definition';
import { ages } from '../../core/literals/age.literal';
import { heights } from '../../core/literals/height.literal';
import { races } from '../../core/literals/race.literal';
import { weights } from '../../core/literals/weight.literal';
import { GeneratorService } from './generator.service';
import { ArrayView } from '../../core/view-models/array.view';

import {
  mockedProfessionStore,
  mockedRandomIntHelper,
  setupMocks,
} from '../../../tests/mocks';

describe('GeneratorService', () => {
  const service = new GeneratorService(
    instance(mockedRandomIntHelper),
    instance(mockedProfessionStore)
  );

  beforeEach(() => {
    setupMocks();

    when(mockedProfessionStore.professions).thenReturn({
      'Police Detective': ArrayView.empty(),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generating random characteristics', () => {
    it('should have STR | VIT | AGI | INT | ESN | APP', () => {
      when(mockedRandomIntHelper.getRandomInterval(1, 6))
        .thenReturn(1)
        .thenReturn(3)
        .thenReturn(3)
        .thenReturn(3)
        .thenReturn(4)
        .thenReturn(4)
        .thenReturn(3)
        .thenReturn(4)
        .thenReturn(1)
        .thenReturn(1)
        .thenReturn(2)
        .thenReturn(1);

      const characteristics = service.characteristics();

      expect(characteristics).toEqual(expectedCharacteristics);
    });
  });

  describe('generating random identity', () => {
    it('should have new identity', () => {
      when(
        mockedRandomIntHelper.getRandomInterval(anyNumber(), anyNumber())
      ).thenReturn(0);

      const identity = service.identity();

      expect(identity.profession).toEqual(expectedIdentity.profession);
      expect(identity.age).toEqual(expectedIdentity.age);
      expect(identity.race).toEqual(expectedIdentity.race);
      expect(identity.height).toEqual(expectedIdentity.height);
      expect(identity.weight).toEqual(expectedIdentity.weight);
      expect(identity.name).not.toBeNull();
    });
  });
});

const expectedCharacteristics = {
  STR: new CharacteristicDefinition('STR', 10),
  VIT: new CharacteristicDefinition('VIT', 12),
  AGI: new CharacteristicDefinition('AGI', 14),
  INT: new CharacteristicDefinition('INT', 13),
  ESN: new CharacteristicDefinition('ESN', 8),
  APP: new CharacteristicDefinition('APP', 9),
};

const expectedIdentity = new CharacterIdentityDefinition(
  'Alice Shields',
  'Police Detective',
  ages[0],
  races[0],
  heights[0],
  weights[0],
  'VISIBLE'
);

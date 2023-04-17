import { TestBed } from '@angular/core/testing';

import { anyNumber, instance, when } from 'ts-mockito';

import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { ages } from '../literals/age.literal';
import { heights } from '../literals/height.literal';
import { races } from '../literals/race.literal';
import { weights } from '../literals/weight.literal';
import { GeneratorService } from './generator.service';
import { RandomIntService } from './random-int.service';
import { DirectionLiteral } from '../literals/direction.literal';
import { ProfessionStore } from '../stores/profession.store';
import { ArrayView } from '../view-models/array.view';

import {
  mockedProfessionStore,
  mockedRandomIntService,
  setupMocks,
} from '../../../tests/mocks';

describe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RandomIntService,
          useValue: instance(mockedRandomIntService),
        },
        {
          provide: ProfessionStore,
          useValue: instance(mockedProfessionStore),
        },
      ],
    });

    setupMocks();

    when(mockedProfessionStore.professions).thenReturn({
      'Police Detective': ArrayView.create([]),
    });

    service = TestBed.inject(GeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generating random characteristics', () => {
    it('should have STR | VIT | AGI | INT | ESN | APP', () => {
      when(mockedRandomIntService.getRandomInterval(1, 6))
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
        mockedRandomIntService.getRandomInterval(anyNumber(), anyNumber())
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

  describe('generating lock picking sequence', () => {
    it('return sequence', () => {
      when(mockedRandomIntService.getRandomInterval(0, 1))
        .thenReturn(0)
        .thenReturn(0)
        .thenReturn(1)
        .thenReturn(1);

      const expected: DirectionLiteral[] = ['LEFT', 'DOWN', 'RIGHT', 'UP'];

      const result = service.lockPickSequence(4);

      expect(result).toEqual(expected);
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

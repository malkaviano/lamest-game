import { TestBed } from '@angular/core/testing';
import { anyNumber, instance, mock, when } from 'ts-mockito';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { professions } from '../definitions/profession.definition';
import { ages } from '../literals/age.literal';
import { genders } from '../literals/gender.literal';
import { heights } from '../literals/height.literal';
import { races } from '../literals/race.literal';
import { weights } from '../literals/weight.literal';

import { GeneratorService } from './generator.service';
import { RandomIntService } from './random-int.service';

const mockedRandomIntService = mock(RandomIntService);

describe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RandomIntService,
          useValue: instance(mockedRandomIntService),
        },
      ],
    });
    service = TestBed.inject(GeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generating random characteristics', () => {
    it('should have STR | CON | SIZ | DEX | INT | POW | APP', () => {
      when(mockedRandomIntService.getRandomInterval(1, 6))
        .thenReturn(1)
        .thenReturn(3)
        .thenReturn(3)
        .thenReturn(3)
        .thenReturn(3)
        .thenReturn(2)
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
      expect(identity.gender).toEqual(expectedIdentity.gender);
      expect(identity.race).toEqual(expectedIdentity.race);
      expect(identity.height).toEqual(expectedIdentity.height);
      expect(identity.weight).toEqual(expectedIdentity.weight);
      expect(identity.name).not.toBeNull();
    });
  });
});

const expectedCharacteristics = new CharacteristicsDefinition(
  new CharacteristicDefinition('STR', 10),
  new CharacteristicDefinition('CON', 12),
  new CharacteristicDefinition('SIZ', 11),
  new CharacteristicDefinition('DEX', 14),
  new CharacteristicDefinition('INT', 13),
  new CharacteristicDefinition('POW', 8),
  new CharacteristicDefinition('APP', 9)
);

const expectedIdentity = new CharacterIdentityDefinition(
  'Alice Shields',
  professions.keyValues[0],
  genders[0],
  ages[0],
  races[0],
  heights[0],
  weights[0]
);

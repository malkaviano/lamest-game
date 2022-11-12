import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { ages } from '../literals/age.literal';
import { genders } from '../literals/gender.literal';
import { heights } from '../literals/height.literal';
import { professions } from '../literals/profession.literal';
import { races } from '../literals/race.literal';
import { weights } from '../literals/weight.literal';
import { CharacterService } from './character.service';
import { GeneratorService } from './generator.service';
import { Characteristic } from '../definitions/characteristic.definition';
import { Characteristics } from '../definitions/characteristics.definition';
import { DerivedAttributes } from '../definitions/attributes.definition';
import { DerivedAttribute } from '../definitions/attribute.definition';
import { CharacterIdentity } from '../definitions/character-identity.definition';
import { IdentityFeature } from '../definitions/identity-feature.definition';

const mockedGeneratorService = mock(GeneratorService);

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GeneratorService,
          useValue: instance(mockedGeneratorService),
        },
      ],
    });

    service = TestBed.inject(CharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have identity', () => {
    fakeIdentity();

    const result = service.identity();

    expect(result).toEqual(expectedIdentity);
  });

  it('should have characteristics', () => {
    fakeCharacteristics();

    const result = service.characteristics();

    expect(result).toEqual(expectedCharacteristics);
  });

  it('should have attributes', () => {
    const result = service.attributes(expectedCharacteristics);

    expect(result).toEqual(expectedAttributes);
  });
});

const fakeIdentity = () => {
  when(mockedGeneratorService.identity()).thenReturn(expectedIdentity);
};

const expectedIdentity = new CharacterIdentity(
  new IdentityFeature('NAME', 'Some Name', 'Character name'),
  new IdentityFeature('PROFESSION', professions[0], 'Character profession'),
  new IdentityFeature('GENDER', genders[0], 'Character gender'),
  new IdentityFeature('AGE', ages[0], 'Character age'),
  new IdentityFeature('RACE', races[0], 'Character race'),
  new IdentityFeature('HEIGHT', heights[0], 'Character height'),
  new IdentityFeature('WEIGHT', weights[0], 'Character weight')
);

const fakeCharacteristics = () => {
  when(mockedGeneratorService.characteristics()).thenReturn(
    expectedCharacteristics
  );
};

const expectedCharacteristics = new Characteristics(
  new Characteristic('STR', 8, 'The character physical force'),
  new Characteristic('CON', 9, 'The character body constitution'),
  new Characteristic('SIZ', 10, 'The character body shape'),
  new Characteristic('DEX', 11, 'The character agility'),
  new Characteristic('INT', 12, 'The character intelligence'),
  new Characteristic('POW', 13, 'The character mental strength'),
  new Characteristic('APP', 14, 'The character looks')
);

const expectedAttributes = new DerivedAttributes(
  new DerivedAttribute('HP', 9, 'The character hit points'),
  new DerivedAttribute('PP', 13, 'The character power points'),
  new DerivedAttribute('MOV', 10, 'The character movement')
);

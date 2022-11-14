import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { CharacterService } from './character.service';
import { GeneratorService } from './generator.service';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { RandomIntService } from './random-int.service';
import { CharacterDefinition } from '../definitions/character.definition';

const mockedGeneratorService = mock(GeneratorService);
const mockedRandomIntService = mock(RandomIntService);

describe('CharacterService', () => {
  let service: CharacterService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GeneratorService,
          useValue: instance(mockedGeneratorService),
        },
        {
          provide: RandomIntService,
          useValue: instance(mockedRandomIntService),
        },
      ],
    });

    service = TestBed.inject(CharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('character', () => {
    it('return new character', () => {
      prepareMock();

      const character = service.character();

      expect(character).toEqual(expectedCharacter);
    });
  });
});

const fakeIdentity = () => {
  when(mockedGeneratorService.identity()).thenReturn(expectedIdentity);
};

const expectedIdentity = new CharacterIdentityDefinition(
  'Some Name',
  'Police Detective',
  'MALE',
  'YOUNG',
  'HUMAN',
  'SHORT',
  'LIGHT'
);

const fakeCharacteristics = () => {
  when(mockedGeneratorService.characteristics()).thenReturn(
    expectedCharacteristics
  );
};

const prepareMock = () => {
  fakeIdentity();

  fakeCharacteristics();

  when(mockedRandomIntService.getRandomInterval(0, 1)).thenReturn(1);
};

const expectedCharacteristics = new CharacteristicsDefinition(
  new CharacteristicDefinition('STR', 8),
  new CharacteristicDefinition('CON', 9),
  new CharacteristicDefinition('SIZ', 10),
  new CharacteristicDefinition('DEX', 11),
  new CharacteristicDefinition('INT', 12),
  new CharacteristicDefinition('POW', 13),
  new CharacteristicDefinition('APP', 14)
);

const expectedAttributes = new DerivedAttributesDefinition(
  new DerivedAttributeDefinition('HP', 9),
  new DerivedAttributeDefinition('PP', 13),
  new DerivedAttributeDefinition('MOV', 10)
);

const expectedSkills = {
  'Firearm (Handgun)': 30 + expectedCharacteristics.dex.value + 5,
  'First Aid': 30 + expectedCharacteristics.int.value + 5,
  Listen: 30 + expectedCharacteristics.pow.value + 5,
  Persuade: 30 + expectedCharacteristics.app.value + 5,
  Spot: 30 + expectedCharacteristics.pow.value + 5,
  Research: 30 + expectedCharacteristics.int.value + 5,
  'Drive (Automobile)': 30 + expectedCharacteristics.int.value + 5,
  Brawl:
    30 +
    expectedCharacteristics.str.value +
    expectedCharacteristics.dex.value +
    5,
  Dodge: 30 + 2 * expectedCharacteristics.dex.value + 5,
  Athleticism:
    expectedCharacteristics.str.value +
    expectedCharacteristics.con.value +
    expectedCharacteristics.dex.value +
    5,
  Appraise: expectedCharacteristics.int.value + 5,
  Bargain: expectedCharacteristics.app.value + 5,
  Disguise: expectedCharacteristics.app.value + 5,
  Gaming:
    expectedCharacteristics.int.value + expectedCharacteristics.pow.value + 5,
  Hide: expectedCharacteristics.pow.value + 5,
  Insight: expectedCharacteristics.pow.value + 5,
  'Melee Weapon (Simple)': expectedCharacteristics.str.value + 5,
  'Missile Weapon (Throw)': expectedCharacteristics.dex.value + 5,
  Navigate: expectedCharacteristics.int.value + 5,
  Performance: expectedCharacteristics.app.value + 5,
  'Sleight of Hand': expectedCharacteristics.dex.value + 5,
  Stealth: expectedCharacteristics.dex.value + 5,
  Survival: expectedCharacteristics.int.value + 5,
  Throw: expectedCharacteristics.dex.value + 5,
  'Firearm (Shooter)': 30 + expectedCharacteristics.dex.value,
};

const expectedCharacter = new CharacterDefinition(
  expectedIdentity,
  expectedCharacteristics,
  expectedAttributes,
  expectedSkills
);

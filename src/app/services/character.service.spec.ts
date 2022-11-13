import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { CharacterService } from './character.service';
import { GeneratorService } from './generator.service';
import { Characteristic } from '../definitions/characteristic.definition';
import { Characteristics } from '../definitions/characteristics.definition';
import { DerivedAttributes } from '../definitions/attributes.definition';
import { DerivedAttribute } from '../definitions/attribute.definition';
import { CharacterIdentity } from '../definitions/character-identity.definition';
import { RandomIntService } from './random-int.service';

const mockedGeneratorService = mock(GeneratorService);
const mockedRandomIntService = mock(RandomIntService);

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
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

  it('should have skills', () => {
    when(mockedRandomIntService.getRandomInterval(0, 1)).thenReturn(1);

    const result = service.skills(expectedIdentity, expectedCharacteristics);

    expect(result).toEqual(expectedSkills);
  });
});

const fakeIdentity = () => {
  when(mockedGeneratorService.identity()).thenReturn(expectedIdentity);
};

const expectedIdentity = new CharacterIdentity(
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

const expectedCharacteristics = new Characteristics(
  new Characteristic('STR', 8),
  new Characteristic('CON', 9),
  new Characteristic('SIZ', 10),
  new Characteristic('DEX', 11),
  new Characteristic('INT', 12),
  new Characteristic('POW', 13),
  new Characteristic('APP', 14)
);

const expectedAttributes = new DerivedAttributes(
  new DerivedAttribute('HP', 9),
  new DerivedAttribute('PP', 13),
  new DerivedAttribute('MOV', 10)
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

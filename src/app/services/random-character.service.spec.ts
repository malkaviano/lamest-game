import { TestBed } from '@angular/core/testing';

import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

import { RandomCharacterService } from './random-character.service';
import { GeneratorService } from './generator.service';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { CharacterEntity } from '../entities/character.entity';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { SkillService } from './skill.service';

const mockedGeneratorService = mock(GeneratorService);
const mockedSkillService = mock(SkillService);

describe('RandomCharacterService', () => {
  let service: RandomCharacterService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GeneratorService,
          useValue: instance(mockedGeneratorService),
        },
        {
          provide: SkillService,
          useValue: instance(mockedSkillService),
        },
      ],
    });

    service = TestBed.inject(RandomCharacterService);

    prepareMock();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('character', () => {
    it('return new character', () => {
      const character = service.character();

      expect(character).toEqual(expectedCharacter);
    });
  });
});

const prepareMock = () => {
  when(mockedGeneratorService.identity()).thenReturn(fakeIdentity);

  when(mockedGeneratorService.characteristics()).thenReturn(
    fakeCharacteristics
  );

  when(mockedSkillService.distribute(anything(), anyNumber()))
    .thenReturn(
      new Map([
        ['Firearm (Handgun)', 0],
        ['First Aid', 0],
        ['Listen', 0],
        ['Persuade', 0],
        ['Spot', 0],
        ['Research', 0],
        ['Drive (Automobile)', 0],
        ['Firearm (Shooter)', 0],
        ['Brawl', 0],
        ['Dodge', 0],
      ])
    )
    .thenReturn(fakeSkills);
};

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
  ['Firearm (Handgun)', 35],
  ['First Aid', 35],
  ['Listen', 35],
  ['Persuade', 35],
  ['Spot', 35],
  ['Research', 35],
  ['Drive (Automobile)', 35],
  ['Firearm (Shooter)', 35],
  ['Brawl', 35],
  ['Dodge', 35],
  ['Athleticism', 5],
  ['Appraise', 5],
  ['Bargain', 5],
  ['Disguise', 5],
  ['Gaming', 5],
  ['Hide', 5],
  ['Insight', 5],
  ['Melee Weapon (Simple)', 5],
  ['Missile Weapon (Throw)', 5],
  ['Navigate', 5],
  ['Performance', 5],
  ['Sleight of Hand', 5],
  ['Stealth', 5],
  ['Survival', 5],
  ['Throw', 0],
]);

const expectedCharacter = new CharacterEntity(
  fakeIdentity,
  fakeCharacteristics,
  fakeSkills
);

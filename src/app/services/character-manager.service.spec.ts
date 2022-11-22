import { TestBed } from '@angular/core/testing';

import { instance, mock, reset, when } from 'ts-mockito';

import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { CharacterEntity } from '../entities/character.entity';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { CharacterManagerService } from './character-manager.service';
import { RandomCharacterService } from './random-character.service';

describe('CharacterManagerService', () => {
  let service: CharacterManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RandomCharacterService,
          useValue: instance(mockedRandomCharacterService),
        },
      ],
    });

    reset(mockedRandomCharacterService);

    when(mockedRandomCharacterService.character())
      .thenReturn(expected)
      .thenReturn(random);

    service = TestBed.inject(CharacterManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when generating a random character', () => {
    it('return a random character', () => {
      const result = service.randomCharacter;

      expect(result).toEqual(random);
    });
  });

  describe('when getting the current character', () => {
    describe('when a character has been generated', () => {
      it('return the same character', () => {
        const character1 = service.currentCharacter;

        const character2 = service.currentCharacter;

        expect(character1).toEqual(character2);
      });
    });

    describe('when no character has been generated', () => {
      it('return a random generated character', () => {
        const character = service.currentCharacter;

        expect(character).toEqual(expected);
      });
    });
  });
});

const mockedRandomCharacterService = mock(RandomCharacterService);

const expected = new CharacterEntity(
  new IdentityDefinition(
    'name',
    'Hunter',
    'FEMALE',
    'ADULT',
    'HUMAN',
    'AVERAGE',
    'AVERAGE'
  ),
  new CharacteristicsDefinition(
    new CharacteristicDefinition('STR', 12),
    new CharacteristicDefinition('CON', 12),
    new CharacteristicDefinition('SIZ', 12),
    new CharacteristicDefinition('DEX', 12),
    new CharacteristicDefinition('INT', 12),
    new CharacteristicDefinition('POW', 12),
    new CharacteristicDefinition('APP', 12)
  ),
  new Map<SkillNameLiteral, number>([
    ['Firearm (Handgun)', 50],
    ['First Aid', 35],
    ['Listen', 20],
    ['Persuade', 60],
    ['Spot', 40],
    ['Research', 35],
    ['Drive (Automobile)', 30],
    ['Engineering (Computer)', 25],
    ['Disguise', 45],
    ['Athleticism', 5],
    ['Appraise', 10],
    ['Bargain', 10],
    ['Brawl', 10],
    ['Dodge', 5],
    ['Gaming', 10],
    ['Hide', 10],
    ['Insight', 10],
    ['Melee Weapon (Simple)', 5],
    ['Missile Weapon (Throw)', 0],
    ['Navigate', 0],
    ['Performance', 0],
    ['Sleight of Hand', 10],
    ['Survival', 0],
    ['Throw', 5],
  ])
);

const random = new CharacterEntity(
  new IdentityDefinition(
    'name',
    'Doctor',
    'MALE',
    'ADULT',
    'HUMAN',
    'AVERAGE',
    'AVERAGE'
  ),
  new CharacteristicsDefinition(
    new CharacteristicDefinition('STR', 12),
    new CharacteristicDefinition('CON', 12),
    new CharacteristicDefinition('SIZ', 12),
    new CharacteristicDefinition('DEX', 12),
    new CharacteristicDefinition('INT', 12),
    new CharacteristicDefinition('POW', 12),
    new CharacteristicDefinition('APP', 12)
  ),
  new Map<SkillNameLiteral, number>([
    ['Firearm (Handgun)', 50],
    ['First Aid', 35],
    ['Listen', 20],
    ['Persuade', 60],
    ['Spot', 40],
    ['Research', 35],
    ['Drive (Automobile)', 30],
    ['Engineering (Computer)', 25],
    ['Disguise', 45],
    ['Athleticism', 5],
    ['Appraise', 10],
    ['Bargain', 10],
    ['Brawl', 10],
    ['Dodge', 5],
    ['Gaming', 10],
    ['Hide', 10],
    ['Insight', 10],
    ['Melee Weapon (Simple)', 5],
    ['Missile Weapon (Throw)', 0],
    ['Navigate', 0],
    ['Performance', 0],
    ['Sleight of Hand', 10],
    ['Survival', 0],
    ['Throw', 5],
  ])
);

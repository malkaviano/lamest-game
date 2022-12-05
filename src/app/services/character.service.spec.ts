import { TestBed } from '@angular/core/testing';

import { take } from 'rxjs';
import { instance, mock, reset, when } from 'ts-mockito';

import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacterEntity } from '../entities/character.entity';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { CharacterService } from './character.service';
import { RandomCharacterService } from './random-character.service';

describe('CharacterService', () => {
  let service: CharacterService;

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

    service = TestBed.inject(CharacterService);
  });

  describe('character changed events', () => {
    describe('on creation', () => {
      it('should emit and event', (done) => {
        let result: CharacterEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        done();

        expect(result).toEqual(expected);
      });
    });

    describe('when character takes damage', () => {
      it('should emit and event', (done) => {
        let result: CharacterEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        service.currentCharacter.damaged(4);

        done();

        expect(result?.derivedAttributes['HP'].value).toEqual(8);
      });
    });
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
    'ADULT',
    'HUMAN',
    'AVERAGE',
    'AVERAGE'
  ),
  {
    STR: new CharacteristicDefinition('STR', 12),
    CON: new CharacteristicDefinition('CON', 12),
    SIZ: new CharacteristicDefinition('SIZ', 12),
    DEX: new CharacteristicDefinition('DEX', 12),
    INT: new CharacteristicDefinition('INT', 12),
    POW: new CharacteristicDefinition('POW', 12),
    APP: new CharacteristicDefinition('APP', 12),
  },
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
    'ADULT',
    'HUMAN',
    'AVERAGE',
    'AVERAGE'
  ),
  {
    STR: new CharacteristicDefinition('STR', 12),
    CON: new CharacteristicDefinition('CON', 12),
    SIZ: new CharacteristicDefinition('SIZ', 12),
    DEX: new CharacteristicDefinition('DEX', 12),
    INT: new CharacteristicDefinition('INT', 12),
    POW: new CharacteristicDefinition('POW', 12),
    APP: new CharacteristicDefinition('APP', 12),
  },
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

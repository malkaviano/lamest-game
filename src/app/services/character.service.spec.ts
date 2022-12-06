import { TestBed } from '@angular/core/testing';

import { Subject, take } from 'rxjs';
import { instance, mock, reset, when } from 'ts-mockito';

import { CharacterEntity } from '../entities/character.entity';
import { CharacterService } from './character.service';
import { RandomCharacterService } from './random-character.service';
import { HitPointsEvent } from '../events/hitpoints.event';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';

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

    when(mockedRandomCharacterService.character()).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedCharacterEntity.hpChanged$).thenReturn(subjectHP);

    when(mockedCharacterEntity.weaponEquippedChanged$).thenReturn(
      subjectWeapon
    );

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

        expect(result).toEqual(instance(mockedCharacterEntity));
      });
    });

    describe('when character takes damage', () => {
      it('should emit and event', (done) => {
        let result: CharacterEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        subjectHP.next(new HitPointsEvent(12, 8));

        done();

        expect(result).toEqual(instance(mockedCharacterEntity));
      });
    });

    describe('when character equips a Weapon', () => {
      it('should emit and event', (done) => {
        let result: CharacterEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        subjectWeapon.next(weapon1);

        done();

        expect(result).toEqual(instance(mockedCharacterEntity));
      });
    });
  });

  describe('when generating a random character', () => {
    it('return a random character', () => {
      const result = service.randomCharacter;

      expect(result).toEqual(instance(mockedCharacterEntity));
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

        expect(character).toEqual(instance(mockedCharacterEntity));
      });
    });
  });
});

const mockedRandomCharacterService = mock(RandomCharacterService);

const mockedCharacterEntity = mock(CharacterEntity);

const subjectHP = new Subject<HitPointsEvent>();

const subjectWeapon = new Subject<WeaponDefinition>();

const weapon1 = new WeaponDefinition(
  'sword1',
  'Rusted Sword',
  'Old sword full of rust',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice({ D6: 1 }), 0),
  true,
  'PERMANENT'
);

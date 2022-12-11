import { TestBed } from '@angular/core/testing';

import { Subject, take } from 'rxjs';
import { instance, when } from 'ts-mockito';

import { PlayerEntity } from '../entities/player.entity';
import { CharacterService } from './character.service';
import { RandomCharacterService } from './random-character.service';
import { HitPointsEvent } from '../events/hitpoints.event';
import { WeaponDefinition } from '../definitions/weapon.definition';

import { simpleSword } from '../../../tests/fakes';
import {
  mockedPlayerEntity,
  mockedRandomCharacterService,
  setupMocks,
} from '../../../tests/mocks';

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

    setupMocks();

    when(mockedRandomCharacterService.character()).thenReturn(
      instance(mockedPlayerEntity)
    );

    when(mockedPlayerEntity.hpChanged$).thenReturn(subjectHP);

    when(mockedPlayerEntity.weaponEquippedChanged$).thenReturn(subjectWeapon);

    service = TestBed.inject(CharacterService);
  });

  describe('character changed events', () => {
    describe('on creation', () => {
      it('should emit and event', (done) => {
        let result: PlayerEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        done();

        expect(result).toEqual(instance(mockedPlayerEntity));
      });
    });

    describe('when character takes damage', () => {
      it('should emit and event', (done) => {
        let result: PlayerEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        subjectHP.next(new HitPointsEvent(12, 8));

        done();

        expect(result).toEqual(instance(mockedPlayerEntity));
      });
    });

    describe('when character equips a Weapon', () => {
      it('should emit and event', (done) => {
        let result: PlayerEntity | undefined;

        service.characterChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        subjectWeapon.next(simpleSword);

        done();

        expect(result).toEqual(instance(mockedPlayerEntity));
      });
    });
  });

  describe('when generating a random character', () => {
    it('return a random character', () => {
      const result = service.randomCharacter;

      expect(result).toEqual(instance(mockedPlayerEntity));
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

        expect(character).toEqual(instance(mockedPlayerEntity));
      });
    });
  });
});

const subjectHP = new Subject<HitPointsEvent>();

const subjectWeapon = new Subject<WeaponDefinition>();

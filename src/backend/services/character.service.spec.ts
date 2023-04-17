import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';
import { instance, when } from 'ts-mockito';

import { PlayerEntity } from '../entities/player.entity';
import { CharacterService } from './character.service';
import { RandomCharacterService } from './random-character.service';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { VisibilityLiteral } from '../../core/literals/visibility.literal';
import { EnergyPointsEvent } from '../../core/events/energy-points.event';
import { HitPointsEvent } from '../../core/events/hit-points.event';

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

    when(mockedPlayerEntity.epChanged$).thenReturn(subjectEP);

    when(mockedPlayerEntity.weaponEquippedChanged$).thenReturn(subjectWeapon);

    when(mockedPlayerEntity.visibilityChanged$).thenReturn(subjectVisibility);

    service = TestBed.inject(CharacterService);
  });

  describe('character changed events', () => {
    describe('on creation', () => {
      it('should emit an event', (done) => {
        let result: PlayerEntity | undefined;

        service.characterChanged$.subscribe((event) => {
          result = event;
        });

        done();

        expect(result).toEqual(instance(mockedPlayerEntity));
      });
    });

    describe('when character takes damage', () => {
      it('should emit an event', (done) => {
        let result: PlayerEntity | undefined;

        service.characterChanged$.subscribe((event) => {
          result = event;
        });

        subjectHP.next(new HitPointsEvent(12, 8));

        done();

        expect(result).toEqual(instance(mockedPlayerEntity));
      });
    });

    describe('when character equips a Weapon', () => {
      it('should emit an event', (done) => {
        let result: PlayerEntity | undefined;

        service.characterChanged$.subscribe((event) => {
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

  describe('when character spent energy', () => {
    it('should emit an event', (done) => {
      let result: PlayerEntity | undefined;

      service.characterChanged$.subscribe((event) => {
        result = event;
      });

      subjectEP.next(new EnergyPointsEvent(12, 8));

      done();

      expect(result).toEqual(instance(mockedPlayerEntity));
    });
  });

  describe('when character visibility change', () => {
    it('should emit an event', (done) => {
      let result: PlayerEntity | undefined;

      service.characterChanged$.subscribe((event) => {
        result = event;
      });

      subjectVisibility.next('DISGUISED');

      done();

      expect(result).toEqual(instance(mockedPlayerEntity));
    });
  });
});

const subjectHP = new Subject<HitPointsEvent>();

const subjectEP = new Subject<EnergyPointsEvent>();

const subjectVisibility = new Subject<VisibilityLiteral>();

const subjectWeapon = new Subject<WeaponDefinition>();

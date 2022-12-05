import { TestBed } from '@angular/core/testing';

import { Subject, take } from 'rxjs';
import { instance, mock, reset, when } from 'ts-mockito';

import { CharacterEntity } from '../entities/character.entity';
import { CharacterService } from './character.service';
import { RandomCharacterService } from './random-character.service';
import { HitPointsEvent } from '../events/hitpoints.event';

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

    when(mockedCharacterEntity.hpChanged$).thenReturn(subject);

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

        subject.next(new HitPointsEvent(12, 8));

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

const subject = new Subject<HitPointsEvent>();

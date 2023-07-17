import { Subject } from 'rxjs';
import { instance, when } from 'ts-mockito';

import { CharacterService } from '@services/character.service';
import { VisibilityLiteral } from '@literals/visibility.literal';
import {
  CurrentAPChangedEvent,
  CurrentEPChangedEvent,
  CurrentHPChangedEvent,
  DerivedAttributeEvent,
} from '@events/derived-attribute.event';
import { WeaponChangedEvent } from '@events/equipment-changed.event';
import { unarmedWeapon } from '@behaviors/equipment.behavior';

import { simpleSword } from '../../../tests/fakes';
import {
  mockedPlayerEntity,
  mockedRandomCharacterService,
  setupMocks,
} from '../../../tests/mocks';

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
    setupMocks();

    when(mockedRandomCharacterService.character()).thenReturn(
      instance(mockedPlayerEntity)
    );

    when(mockedPlayerEntity.derivedAttributeChanged$).thenReturn(
      subjectDerivedAttribute
    );

    when(mockedPlayerEntity.equipmentChanged$).thenReturn(subjectWeapon);

    when(mockedPlayerEntity.visibilityChanged$).thenReturn(subjectVisibility);

    service = new CharacterService(instance(mockedRandomCharacterService));
  });

  describe('character changed events', () => {
    describe('on creation', () => {
      it('should emit an event', (done) => {
        testEvent(service, done);
      });
    });

    describe('when character takes damage', () => {
      it('should emit an event', (done) => {
        testEvent(service, done, () => {
          subjectDerivedAttribute.next(new CurrentHPChangedEvent(12, 8));
        });
      });
    });

    describe('when character equips a Weapon', () => {
      it('should emit an event', (done) => {
        testEvent(service, done, () => {
          subjectWeapon.next(
            new WeaponChangedEvent(unarmedWeapon, simpleSword)
          );
        });
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
      testEvent(service, done, () => {
        subjectDerivedAttribute.next(new CurrentEPChangedEvent(12, 8));
      });
    });
  });

  describe('when character visibility change', () => {
    it('should emit an event', (done) => {
      testEvent(service, done, () => {
        subjectVisibility.next('DISGUISED');
      });
    });
  });

  describe('when character spent action points', () => {
    it('should emit an event', (done) => {
      testEvent(service, done, () => {
        subjectDerivedAttribute.next(new CurrentAPChangedEvent(12, 8));
      });
    });
  });
});

const subjectDerivedAttribute = new Subject<DerivedAttributeEvent>();

const subjectVisibility = new Subject<VisibilityLiteral>();

const subjectWeapon = new Subject<WeaponChangedEvent>();

function testEvent(
  service: CharacterService,
  done: DoneFn,
  action?: () => void
) {
  let result = false;

  service.characterChanged$.subscribe(() => {
    result = true;
  });

  if (action) {
    action();
  }

  done();

  expect(result).toEqual(true);
}

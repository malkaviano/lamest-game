import { Subject } from 'rxjs';
import { instance, when } from 'ts-mockito';

import { CharacterService } from './character.service';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { VisibilityLiteral } from '../../core/literals/visibility.literal';
import { EnergyPointsEvent } from '../../core/events/energy-points.event';
import { HitPointsEvent } from '../../core/events/hit-points.event';
import { ActionPointsEvent } from '../../core/events/action-points.event';

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

    when(mockedPlayerEntity.hpChanged$).thenReturn(subjectHP);

    when(mockedPlayerEntity.epChanged$).thenReturn(subjectEP);

    when(mockedPlayerEntity.weaponEquippedChanged$).thenReturn(subjectWeapon);

    when(mockedPlayerEntity.visibilityChanged$).thenReturn(subjectVisibility);

    when(mockedPlayerEntity.apChanged$).thenReturn(subjectAP);

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
          subjectHP.next(new HitPointsEvent(12, 8));
        });
      });
    });

    describe('when character equips a Weapon', () => {
      it('should emit an event', (done) => {
        testEvent(service, done, () => {
          subjectWeapon.next(simpleSword);
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
        subjectEP.next(new EnergyPointsEvent(12, 8));
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
        subjectAP.next(new ActionPointsEvent(12, 8));
      });
    });
  });
});

const subjectHP = new Subject<HitPointsEvent>();

const subjectEP = new Subject<EnergyPointsEvent>();

const subjectVisibility = new Subject<VisibilityLiteral>();

const subjectWeapon = new Subject<WeaponDefinition>();

const subjectAP = new Subject<ActionPointsEvent>();

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

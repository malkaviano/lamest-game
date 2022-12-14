import { instance } from 'ts-mockito';

import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorBehavior } from './actor.behavior';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeMapSkills,
} from '../../../tests/fakes';
import { mockedSkillStore, setupMocks } from '../../../tests/mocks';

describe('ActorBehavior', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('characteristics', () => {
    it('return characteristics', () => {
      expect(fakeBehavior().characteristics).toEqual(fakeCharacteristics);
    });
  });

  describe('derived attributes', () => {
    it('return derived attributes', () => {
      expect(fakeBehavior().derivedAttributes).toEqual(fakeDerivedAttributes);
    });
  });

  describe('skills', () => {
    it('return skills with characteristics applied', () => {
      const expectedSkills = {
        'First Aid': 57,
        'Melee Weapon (Simple)': 53,
        Brawl: 53,
      };

      expect(fakeBehavior().skills).toEqual(expectedSkills);
    });
  });

  describe('damaged', () => {
    it('return HitPointsEvent previous 8 current 0', () => {
      const result = fakeBehavior().damaged(12);

      expect(result).toEqual(new HitPointsEvent(8, 0));
    });
  });

  describe('healed', () => {
    it('return HitPointsEvent previous 6 current 8', () => {
      const char = fakeBehavior();

      char.damaged(2);

      const result = char.healed(4);

      expect(result).toEqual(new HitPointsEvent(6, 8));
    });
  });

  describe('situation', () => {
    describe('when HP is above 0', () => {
      it('return ALIVE', () => {
        expect(fakeBehavior().situation).toEqual('ALIVE');
      });
    });

    describe('when HP is 0', () => {
      it('return DEAD', () => {
        const b = fakeBehavior();

        b.damaged(100);

        expect(b.situation).toEqual('DEAD');
      });
    });
  });
});

const fakeBehavior = () =>
  new ActorBehavior(
    fakeCharacteristics,
    fakeMapSkills,
    instance(mockedSkillStore)
  );

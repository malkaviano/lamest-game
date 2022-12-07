import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorBehavior } from './actor.behavior';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeMapSkills,
} from '../../../tests/fakes';

describe('ActorBehavior', () => {
  describe('characteristics', () => {
    it('return characteristics', () => {
      expect(behavior().characteristics).toEqual(fakeCharacteristics);
    });
  });

  describe('derived attributes', () => {
    it('return derived attributes', () => {
      expect(behavior().derivedAttributes).toEqual(fakeDerivedAttributes);
    });
  });

  describe('skills', () => {
    it('return skills with characteristics applied', () => {
      const expectedSkills = {
        'First Aid': 57,
        'Melee Weapon (Simple)': 53,
        Brawl: 64,
      };

      expect(behavior().skills).toEqual(expectedSkills);
    });
  });

  describe('damaged', () => {
    it('return HitPointsEvent previous 9 current 0', () => {
      const result = behavior().damaged(12);

      expect(result).toEqual(new HitPointsEvent(9, 0));
    });
  });

  describe('healed', () => {
    it('return HitPointsEvent previous 9 current 0', () => {
      const char = behavior();

      char.damaged(2);

      const result = char.healed(4);

      expect(result).toEqual(new HitPointsEvent(7, 9));
    });
  });

  describe('situation', () => {
    describe('when HP is above 0', () => {
      it('return ALIVE', () => {
        expect(behavior().situation).toEqual('ALIVE');
      });
    });

    describe('when HP is 0', () => {
      it('return DEAD', () => {
        const b = behavior();

        b.damaged(100);

        expect(b.situation).toEqual('DEAD');
      });
    });
  });
});

const behavior = () => new ActorBehavior(fakeCharacteristics, fakeMapSkills);

import { instance } from 'ts-mockito';

import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorBehavior } from './actor.behavior';
import { ArrayView } from '../views/array.view';
import { EffectTypeLiteral } from '../literals/effect-type.literal';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeEffect,
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

  describe('situation', () => {
    describe('when HP is above 0', () => {
      it('return ALIVE', () => {
        expect(fakeBehavior().situation).toEqual('ALIVE');
      });
    });

    describe('when HP is 0', () => {
      it('return DEAD', () => {
        const b = fakeBehavior();

        b.effectReceived(fakeEffect('PROFANE', 4));

        b.effectReceived(fakeEffect('PROFANE', 4));

        expect(b.situation).toEqual('DEAD');
      });
    });
  });

  describe('effectReceived', () => {
    describe('when behavior is immune to the effect', () => {
      it('return HitPointsEvent previous 8 current 8', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(fakeEffect('ACID', 4));

        expect(result).toEqual(new HitPointsEvent(8, 8));
      });
    });

    describe('when behavior is vulnerable to the effect', () => {
      it('return HitPointsEvent previous 8 current 2', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(fakeEffect('PROFANE', 4));

        expect(result).toEqual(new HitPointsEvent(8, 2));
      });
    });

    describe('when behavior is resistant to the effect', () => {
      it('return HitPointsEvent previous 8 current 6', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(fakeEffect('KINETIC', 4));

        expect(result).toEqual(new HitPointsEvent(8, 6));
      });
    });

    describe('when behavior is indifferent to the effect', () => {
      it('return HitPointsEvent previous 8 current 4', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(fakeEffect('ARCANE', 4));

        expect(result).toEqual(new HitPointsEvent(8, 4));
      });
    });

    [
      {
        effect: fakeEffect('REMEDY', 4),
        current: 8,
      },
      {
        effect: fakeEffect('SACRED', 4),
        current: 6,
      },
    ].forEach(({ effect, current }) => {
      describe(`when behavior is cured by ${effect}`, () => {
        it('return HitPointsEvent previous 4 current 8', () => {
          const b = fakeBehavior();

          b.effectReceived(fakeEffect('ARCANE', 4));

          const result = b.effectReceived(effect);

          expect(result).toEqual(new HitPointsEvent(4, current));
        });
      });
    });
  });
});

const fakeBehavior = () =>
  ActorBehavior.create(
    fakeCharacteristics,
    fakeMapSkills,
    instance(mockedSkillStore),
    {
      immunities: ArrayView.create<EffectTypeLiteral>(['ACID']),
      cures: ArrayView.create<EffectTypeLiteral>(['REMEDY', 'SACRED']),
      vulnerabilities: ArrayView.create<EffectTypeLiteral>(['PROFANE']),
      resistances: ArrayView.create<EffectTypeLiteral>(['KINETIC', 'SACRED']),
    },
    {
      resistanceCoefficient: 0.5,
      vulnerabilityCoefficient: 1.5,
    }
  );

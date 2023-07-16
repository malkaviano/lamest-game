import { instance } from 'ts-mockito';

import { ActorBehavior } from '@behaviors/actor.behavior';
import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import {
  CurrentAPChangedEvent,
  CurrentEPChangedEvent,
  CurrentHPChangedEvent,
} from '@events/derived-attribute.event';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeEffect,
  fakeMapSkills,
} from '../../../tests/fakes';
import { mockedSkillStore, setupMocks } from '../../../tests/mocks';

const fakeCharacteristicsAgi = (agi: number) => {
  return {
    STR: new CharacteristicDefinition('STR', 8),
    VIT: new CharacteristicDefinition('VIT', 9),
    AGI: new CharacteristicDefinition('AGI', agi),
    INT: new CharacteristicDefinition('INT', 12),
    ESN: new CharacteristicDefinition('ESN', 13),
    APP: new CharacteristicDefinition('APP', 14),
  };
};

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

        expect(result).toEqual(new CurrentHPChangedEvent(8, 8));
      });
    });

    describe('when behavior is vulnerable to the effect', () => {
      [
        {
          value: 4,
          expected: new CurrentHPChangedEvent(8, 2),
        },
        {
          value: 1,
          expected: new CurrentHPChangedEvent(8, 7),
        },
        {
          value: 5,
          expected: new CurrentHPChangedEvent(8, 1),
        },
      ].forEach(({ value, expected }) => {
        it(`return HitPointsEvent previous ${expected.previous} current ${expected.current}`, () => {
          const b = fakeBehavior();

          const result = b.effectReceived(fakeEffect('PROFANE', value));

          expect(result).toEqual(expected);
        });
      });
    });

    describe('when behavior is resistant to the effect', () => {
      [
        {
          value: 4,
          expected: new CurrentHPChangedEvent(8, 6),
        },
        {
          value: 1,
          expected: new CurrentHPChangedEvent(8, 8),
        },
        {
          value: 5,
          expected: new CurrentHPChangedEvent(8, 6),
        },
      ].forEach(({ value, expected }) => {
        it(`return HitPointsEvent previous ${expected.previous} current ${expected.current}`, () => {
          const b = fakeBehavior();

          const result = b.effectReceived(fakeEffect('KINETIC', value));

          expect(result).toEqual(expected);
        });
      });
    });

    describe('when behavior is indifferent to the effect', () => {
      it('return HitPointsEvent previous 8 current 4', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(fakeEffect('FIRE', 4));

        expect(result).toEqual(new CurrentHPChangedEvent(8, 4));
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

          b.effectReceived(fakeEffect('FIRE', 4));

          const result = b.effectReceived(effect);

          expect(result).toEqual(new CurrentHPChangedEvent(4, current));
        });
      });
    });
  });

  describe('dodgesPerRound', () => {
    [
      {
        characteristics: fakeCharacteristicsAgi(12),
        expected: 1,
      },
      {
        characteristics: fakeCharacteristicsAgi(3),
        expected: 1,
      },
      {
        characteristics: fakeCharacteristicsAgi(30),
        expected: 3,
      },
    ].forEach(({ characteristics, expected }) => {
      it(`return ${expected}`, () => {
        expect(fakeBehavior(characteristics).dodgesPerRound).toEqual(expected);
      });
    });
  });

  describe('energyChange', () => {
    [
      {
        changes: [-14],
        expected: [new CurrentEPChangedEvent(13, 0)],
      },
      {
        changes: [-14, 20],
        expected: [
          new CurrentEPChangedEvent(13, 0),
          new CurrentEPChangedEvent(0, 13),
        ],
      },
    ].forEach(({ changes, expected }) => {
      it('return EnergyPointsEvent', () => {
        const b = fakeBehavior();

        const result = changes.map((change) => b.energyChange(change));

        expect(result).toEqual(expected);
      });
    });
  });

  describe('wannaDodge', () => {
    [
      {
        effect: 'KINETIC',
        expected: true,
      },
      {
        effect: 'PROFANE',
        expected: true,
      },
      {
        effect: 'SACRED',
        expected: false,
      },
      {
        effect: 'FIRE',
        expected: true,
      },
      {
        effect: 'ACID',
        expected: false,
      },
      {
        effect: 'REMEDY',
        expected: false,
      },
    ].forEach(({ effect, expected }) => {
      it(`return ${expected}`, () => {
        expect(fakeBehavior().wannaDodge(effect as EffectTypeLiteral)).toEqual(
          expected
        );
      });
    });
  });

  describe('actionPointsChange', () => {
    [
      {
        changes: [-14],
        expected: [new CurrentAPChangedEvent(6, 0)],
      },
      {
        changes: [-14, 20],
        expected: [
          new CurrentAPChangedEvent(6, 0),
          new CurrentAPChangedEvent(0, 6),
        ],
      },
    ].forEach(({ changes, expected }) => {
      it('return ActionPointsEvent', () => {
        const b = fakeBehavior();

        const result = changes.map((change) => b.actionPointsChange(change));

        expect(result).toEqual(expected);
      });
    });
  });
});

const fakeBehavior = (characteristics = fakeCharacteristics) =>
  ActorBehavior.create(
    characteristics,
    fakeMapSkills,
    instance(mockedSkillStore)
  );

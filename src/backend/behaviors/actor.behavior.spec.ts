import { instance } from 'ts-mockito';

import { ActorBehavior } from '@behaviors/actor.behavior';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import {
  CurrentAPChangedEvent,
  CurrentEPChangedEvent,
  CurrentHPChangedEvent,
} from '@events/derived-attribute.event';
import { clothArmor } from '@behaviors/equipment.behavior';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeEffect,
  fakeMapSkills,
  hardenedJacket,
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

        b.effectReceived(fakeEffect('PROFANE', 4), clothArmor.damageReduction);

        b.effectReceived(fakeEffect('PROFANE', 4), clothArmor.damageReduction);

        expect(b.situation).toEqual('DEAD');
      });
    });
  });

  describe('effectReceived', () => {
    describe('when behavior is immune to the effect', () => {
      it('return HitPointsEvent previous 8 current 8', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(
          fakeEffect('ACID', 4),
          clothArmor.damageReduction
        );

        expect(result).toEqual(
          new CurrentHPChangedEvent(8, 8, {
            ignored: 4,
            amplified: 0,
            deflected: 0,
            resisted: 0,
          })
        );
      });
    });

    describe('when behavior is vulnerable to the effect', () => {
      [
        {
          value: 4,
          expected: new CurrentHPChangedEvent(8, 1, {
            ignored: 0,
            amplified: 3,
            deflected: 0,
            resisted: 0,
          }),
        },
        {
          value: 1,
          expected: new CurrentHPChangedEvent(8, 7, {
            ignored: 0,
            amplified: 0,
            deflected: 0,
            resisted: 0,
          }),
        },
        {
          value: 5,
          expected: new CurrentHPChangedEvent(8, 0, {
            ignored: 0,
            amplified: 3,
            deflected: 0,
            resisted: 0,
          }),
        },
      ].forEach(({ value, expected }) => {
        it(`return HitPointsEvent previous ${expected.previous} current ${expected.current}`, () => {
          const b = fakeBehavior();

          const result = b.effectReceived(
            fakeEffect('PROFANE', value),
            clothArmor.damageReduction
          );

          expect(result).toEqual(expected);
        });
      });
    });

    describe('when behavior is resistant to the effect', () => {
      [
        {
          value: 4,
          expected: new CurrentHPChangedEvent(8, 6, {
            ignored: 0,
            amplified: 0,
            deflected: 0,
            resisted: 2,
          }),
        },
        {
          value: 1,
          expected: new CurrentHPChangedEvent(8, 7, {
            ignored: 0,
            amplified: 0,
            deflected: 0,
            resisted: 0,
          }),
        },
        {
          value: 5,
          expected: new CurrentHPChangedEvent(8, 5, {
            ignored: 0,
            amplified: 0,
            deflected: 0,
            resisted: 2,
          }),
        },
      ].forEach(({ value, expected }) => {
        it(`return HitPointsEvent previous ${expected.previous} current ${expected.current}`, () => {
          const b = fakeBehavior();

          const result = b.effectReceived(
            fakeEffect('KINETIC', value),
            clothArmor.damageReduction
          );

          expect(result).toEqual(expected);
        });
      });
    });

    describe('when behavior is indifferent to the effect', () => {
      it('return HitPointsEvent previous 8 current 4', () => {
        const b = fakeBehavior();

        const result = b.effectReceived(
          fakeEffect('FIRE', 4),
          clothArmor.damageReduction
        );

        expect(result).toEqual(
          new CurrentHPChangedEvent(8, 4, {
            ignored: 0,
            amplified: 0,
            deflected: 0,
            resisted: 0,
          })
        );
      });

      describe('when wearing armor', () => {
        it('return HitPointsEvent previous 8 current 5', () => {
          const b = fakeBehavior();

          const result = b.effectReceived(
            fakeEffect('FIRE', 4),
            hardenedJacket.damageReduction
          );

          expect(result).toEqual(
            new CurrentHPChangedEvent(8, 5, {
              ignored: 0,
              amplified: 0,
              deflected: 1,
              resisted: 0,
            })
          );
        });
      });
    });

    [
      {
        effect: fakeEffect('REMEDY', 4),
        current: 8,
        resisted: 0,
      },
      {
        effect: fakeEffect('SACRED', 4),
        current: 6,
        resisted: 2,
      },
    ].forEach(({ effect, current, resisted }) => {
      describe(`when behavior is cured by ${effect}`, () => {
        it('return HitPointsEvent previous 4 current 8', () => {
          const b = fakeBehavior();

          b.effectReceived(fakeEffect('FIRE', 4), clothArmor.damageReduction);

          const result = b.effectReceived(effect, clothArmor.damageReduction);

          expect(result).toEqual(
            new CurrentHPChangedEvent(4, current, {
              ignored: 0,
              amplified: 0,
              deflected: 0,
              resisted,
            })
          );
        });
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

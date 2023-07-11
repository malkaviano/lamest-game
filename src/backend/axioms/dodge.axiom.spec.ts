import { instance, when } from 'ts-mockito';

import { RollDefinition } from '@definitions/roll.definition';
import { DodgeAxiom } from '@axioms/dodge.axiom';

import {
  mockedGamePredicate,
  mockedPlayerEntity,
  mockedRollHelper,
  setupMocks,
} from '../../../tests/mocks';

describe('DodgeAxiom', () => {
  const axiom = new DodgeAxiom(
    instance(mockedRollHelper),
    instance(mockedGamePredicate)
  );

  const target = instance(mockedPlayerEntity);

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(axiom).toBeTruthy();
  });

  describe('dodge', () => {
    [
      {
        dodgeable: false,
        dodgesPerformed: 0,
        roll: new RollDefinition('IMPOSSIBLE', 0),
        expected: false,
      },
      {
        dodgeable: true,
        dodgesPerformed: 2,
        roll: new RollDefinition('IMPOSSIBLE', 0),
        expected: false,
      },
      {
        dodgeable: true,
        dodgesPerformed: 1,
        roll: new RollDefinition('SUCCESS', 12),
        expected: true,
      },
      {
        dodgeable: true,
        dodgesPerformed: 1,
        roll: new RollDefinition('FAILURE', 72),
        expected: false,
      },
    ].forEach(({ dodgeable, dodgesPerformed, expected, roll }) => {
      it(`return ${expected}`, () => {
        when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

        when(mockedRollHelper.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        when(
          mockedGamePredicate.canDodge(target, dodgeable, dodgesPerformed)
        ).thenReturn(expected);

        const result = axiom.dodged(target, dodgeable, dodgesPerformed);

        expect(result).toEqual(expected);
      });
    });
  });
});

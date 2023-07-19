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
        dodgeable: true,
        roll: new RollDefinition('SUCCESS', 12),
        expected: true,
      },
      {
        dodgeable: true,
        roll: new RollDefinition('FAILURE', 72),
        expected: false,
      },
    ].forEach(({ dodgeable, expected, roll }) => {
      it(`return ${expected}`, () => {
        when(mockedRollHelper.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        when(mockedGamePredicate.canDodge(target, dodgeable)).thenReturn(
          expected
        );

        const result = axiom.dodged(target, dodgeable);

        expect(result).toEqual(expected);
      });
    });
  });
});

import { instance, when } from 'ts-mockito';

import { RollDefinition } from '@definitions/roll.definition';
import { DodgeAxiom } from '@axioms/dodge.axiom';

import {
  mockedGamePredicate,
  mockedPlayerEntity,
  mockedRpgService,
  setupMocks,
} from '../../../tests/mocks';

describe('DodgeAxiom', () => {
  const axiom = new DodgeAxiom(
    instance(mockedRpgService),
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
        canDodge: true,
        expected: true,
      },
      {
        dodgeable: true,
        roll: new RollDefinition('FAILURE', 72),
        canDodge: true,
        expected: false,
      },
      {
        dodgeable: true,
        roll: new RollDefinition('FAILURE', 72),
        canDodge: false,
        expected: undefined,
      },
    ].forEach(({ dodgeable, expected, roll, canDodge }) => {
      it(`return ${expected}`, () => {
        when(mockedRpgService.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        when(mockedGamePredicate.canDodge(target, dodgeable)).thenReturn(
          canDodge
        );

        const result = axiom.dodged(target, dodgeable);

        expect(result).toEqual(expected);
      });
    });
  });
});

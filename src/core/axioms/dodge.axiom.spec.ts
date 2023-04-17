import { instance, when } from 'ts-mockito';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { RollDefinition } from '../definitions/roll.definition';
import { GameStringsStore } from '../../stores/game-strings.store';
import { DodgeAxiom } from './dodge.axiom';

import {
  mockedPlayerEntity,
  mockedRollHelper,
  setupMocks,
} from '../../../tests/mocks';
import { playerInfo } from '../../../tests/fakes';

describe('DodgeAxiom', () => {
  const axiom = new DodgeAxiom(instance(mockedRollHelper));

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
        log: [
          GameStringsStore.createUnDodgeableAttackLogMessage(playerInfo.name),
        ],
        dodged: [],
      },
      {
        dodgeable: true,
        dodgesPerformed: 2,
        roll: new RollDefinition('IMPOSSIBLE', 0),
        expected: false,
        log: [GameStringsStore.createOutOfDodgesLogMessage(playerInfo.name)],
        dodged: [],
      },
      {
        dodgeable: true,
        dodgesPerformed: 1,
        roll: new RollDefinition('SUCCESS', 12),
        expected: true,
        log: [],
        dodged: [playerInfo.id],
      },
      {
        dodgeable: true,
        dodgesPerformed: 1,
        roll: new RollDefinition('FAILURE', 72),
        expected: false,
        log: [],
        dodged: [],
      },
    ].forEach(({ dodgeable, dodgesPerformed, expected, roll, log, dodged }) => {
      it(`return ${expected}`, () => {
        when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

        when(mockedRollHelper.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        const result = axiom.dodge(target, {
          dodgeable,
          dodgesPerformed,
        });

        expect(result).toEqual(expected);
      });

      it('should emit log', (done) => {
        when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

        when(mockedRollHelper.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        const result: LogMessageDefinition[] = [];

        axiom.logMessageProduced$.subscribe((event) => {
          result.push(event);
        });

        axiom.dodge(target, {
          dodgeable,
          dodgesPerformed,
        });

        done();

        expect(result).toEqual(log);
      });

      it('should emit dodged', (done) => {
        when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

        when(mockedRollHelper.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        const result: string[] = [];

        axiom.actorDodged$.subscribe((event) => {
          result.push(event);
        });

        axiom.dodge(target, {
          dodgeable,
          dodgesPerformed,
        });

        done();

        expect(result).toEqual(dodged);
      });
    });
  });
});

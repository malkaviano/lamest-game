import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { RollService } from '../services/roll.service';
import { GameStringsStore } from '../stores/game-strings.store';
import { DodgeAxiomService } from './dodge.axiom.service';

import {
  mockedPlayerEntity,
  mockedRollService,
  setupMocks,
} from '../../../tests/mocks';
import { playerInfo } from '../../../tests/fakes';

describe('DodgeAxiomService', () => {
  let service: DodgeAxiomService;

  const target = instance(mockedPlayerEntity);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(DodgeAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

        when(mockedRollService.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        const result = service.dodge(target, {
          dodgeable,
          dodgesPerformed,
        });

        expect(result).toEqual(expected);
      });

      it('should emit log', (done) => {
        when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

        when(mockedRollService.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        const result: LogMessageDefinition[] = [];

        service.logMessageProduced$.subscribe((event) => {
          result.push(event);
        });

        service.dodge(target, {
          dodgeable,
          dodgesPerformed,
        });

        done();

        expect(result).toEqual(log);
      });

      it('should emit dodged', (done) => {
        when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

        when(mockedRollService.actorSkillCheck(target, 'Dodge')).thenReturn(
          roll
        );

        const result: string[] = [];

        service.actorDodged$.subscribe((event) => {
          result.push(event);
        });

        service.dodge(target, {
          dodgeable,
          dodgesPerformed,
        });

        done();

        expect(result).toEqual(dodged);
      });
    });
  });
});

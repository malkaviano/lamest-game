import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';

import {
  createActorIsDeadMessage,
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { RulesHelper } from '../helpers/rules.helper';
import { CharacterService } from './character.service';
import { GameLoopService } from './game-loop.service';
import { NarrativeService } from './narrative.service';
import { LoggingService } from './logging.service';

import { attackEvent, attackPlayerEvent } from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedCharacterService,
  mockedCombatRule,
  mockedInteractiveEntity,
  mockedLoggingService,
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedRulesHelper,
  setupMocks,
} from '../../../tests/mocks';

describe('GameLoopService', () => {
  let service: GameLoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RulesHelper,
          useValue: instance(mockedRulesHelper),
        },
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
        {
          provide: LoggingService,
          useValue: instance(mockedLoggingService),
        },
      ],
    });

    setupMocks();

    when(mockedActorEntity.action(anything())).thenReturn(attackPlayerEvent);

    when(mockedActorEntity.situation).thenReturn('ALIVE');

    when(mockedPlayerEntity.action).thenReturn(() => attackEvent);

    when(mockedPlayerEntity.situation).thenReturn('ALIVE');

    when(mockedRulesHelper.combatRule).thenReturn(instance(mockedCombatRule));

    service = TestBed.inject(GameLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('reactives', () => {
    describe('when interactive is the player', () => {
      it('return player', () => {
        const result = service.reactives('player');

        expect(result).toEqual(instance(mockedPlayerEntity));
      });
    });

    describe('when interactive is interactive', () => {
      it('return interactive', () => {
        const result = service.reactives('id1');

        expect(result).toEqual(instance(mockedInteractiveEntity));
      });
    });
  });

  describe('run', () => {
    it('return rule logs', () => {
      when(mockedCombatRule.execute(anything(), anything(), anything()))
        .thenReturn({
          logs: [log1],
        })
        .thenReturn({
          logs: [log2],
        });

      const result: LogMessageDefinition[] = [];

      when(mockedLoggingService.log(deepEqual(log1))).thenCall(() => {
        result.push(log1);
      });

      when(mockedLoggingService.log(deepEqual(log2))).thenCall(() => {
        result.push(log2);
      });

      service.run();

      expect(result).toEqual([log1, log2]);
    });

    describe('when player HP reaches 0', () => {
      it('should log player died', () => {
        when(mockedCombatRule.execute(anything(), anything(), anything()))
          .thenReturn({ logs: [log3] })
          .thenCall(() => {
            when(mockedPlayerEntity.situation).thenReturn('DEAD');

            return { logs: [log3] };
          });

        const result: LogMessageDefinition[] = [];

        when(mockedLoggingService.log(deepEqual(logDied))).thenCall(() => {
          result.push(logDied);
        });

        service.run();

        expect(result).toEqual([logDied]);
      });
    });
  });
});

const log1 = createFreeLogMessage('test', 'took some dmg');

const log2 = createFreeLogMessage('player', 'dodged');

const log3 = createFreeLogMessage('player', 'NOOOO');

const logDied = createActorIsDeadMessage('player');

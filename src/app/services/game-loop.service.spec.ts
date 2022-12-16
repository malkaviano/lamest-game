import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';
import { take } from 'rxjs';

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
import { DocumentOpenedInterface } from '../interfaces/reader-dialog.interface';

import {
  actionableEvent,
  actionAttack,
  documentOpened,
  interactiveInfo,
  playerInfo,
} from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedCharacterService,
  mockedCombatRule,
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

    when(mockedActorEntity.action(anything())).thenReturn(eventAttackPlayer);

    when(mockedActorEntity.situation).thenReturn('ALIVE');

    when(mockedPlayerEntity.action).thenReturn(() => eventAttackInteractive);

    when(mockedPlayerEntity.situation).thenReturn('ALIVE');

    when(mockedRulesHelper.combatRule).thenReturn(instance(mockedCombatRule));

    service = TestBed.inject(GameLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

    describe('when documentOpened is returned', () => {
      it('should emit documentOpened event', (done) => {
        let result: DocumentOpenedInterface | undefined;

        when(mockedCombatRule.execute(anything(), anything(), anything()))
          .thenReturn({
            logs: [log1],
            documentOpened: documentOpened,
          })
          .thenReturn({
            logs: [log2],
          });

        service.documentOpened$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        service.run();

        done();

        expect(result).toEqual(documentOpened);
      });
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

const log1 = createFreeLogMessage(interactiveInfo.name, 'took some dmg');

const log2 = createFreeLogMessage(playerInfo.name, 'dodged');

const log3 = createFreeLogMessage(playerInfo.name, 'NOOOO');

const logDied = createActorIsDeadMessage(playerInfo.name);

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

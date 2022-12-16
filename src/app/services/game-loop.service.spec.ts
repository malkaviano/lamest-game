import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';
import { of, take } from 'rxjs';

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
  actorInfo,
  documentOpened,
  interactiveInfo,
  playerInfo,
} from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedActorEntity2,
  mockedCharacterService,
  mockedCombatRule,
  mockedLoggingService,
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedRulesHelper,
  mockedSceneEntity,
  setupMocks,
  mockedInteractiveEntity,
} from '../../../tests/mocks';
import { ArrayView } from '../views/array.view';

describe('GameLoopService', () => {
  let service: GameLoopService;

  const actor = instance(mockedActorEntity);

  const actor2 = instance(mockedActorEntity2);

  const player = instance(mockedPlayerEntity);

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

    when(mockedActorEntity2.action(anything())).thenReturn(eventAttackPlayer);

    when(mockedPlayerEntity.action).thenReturn(() => eventAttackInteractive);

    when(mockedRulesHelper.combatRule).thenReturn(instance(mockedCombatRule));

    when(mockedSceneEntity.interactives).thenReturn(
      ArrayView.create([instance(mockedInteractiveEntity), actor, actor2])
    );

    when(mockedNarrativeService.sceneChanged$).thenReturn(
      of(instance(mockedSceneEntity))
    );

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
        })
        .thenReturn({
          logs: [log3],
        });
      const result: LogMessageDefinition[] = [];

      when(mockedLoggingService.log(deepEqual(log1))).thenCall(() => {
        result.push(log1);
      });

      when(mockedLoggingService.log(deepEqual(log2))).thenCall(() => {
        result.push(log2);
      });

      when(mockedLoggingService.log(deepEqual(log3))).thenCall(() => {
        result.push(log3);
      });

      service.run();

      expect(result).toEqual([log1, log2, log3]);
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

    describe('when actor dodged', () => {
      it('should increment actor dodges', () => {
        when(mockedPlayerEntity.action).thenReturn(() => eventAttackActor);

        when(
          mockedCombatRule.execute(
            player,
            eventAttackActor,
            deepEqual({
              target: actor,
              targetDodgesPerformed: undefined,
            })
          )
        ).thenReturn({
          logs: [log1],
        });

        when(
          mockedCombatRule.execute(
            actor,
            eventAttackPlayer,
            deepEqual({
              target: player,
              targetDodgesPerformed: undefined,
            })
          )
        ).thenReturn({
          logs: [log2],
          dodged: true,
        });

        let result = false;

        when(
          mockedCombatRule.execute(
            actor2,
            eventAttackPlayer,
            deepEqual({
              target: player,
              targetDodgesPerformed: 1,
            })
          )
        ).thenCall(() => {
          result = true;

          return {
            logs: [log2],
            dodged: true,
          };
        });

        service.run();

        expect(result).toEqual(true);
      });
    });

    describe('when player HP reaches 0', () => {
      it('should log player died', () => {
        when(mockedCombatRule.execute(anything(), anything(), anything()))
          .thenReturn({ logs: [log1] })
          .thenReturn({ logs: [log2] })
          .thenCall(() => {
            when(mockedPlayerEntity.situation).thenReturn('DEAD');

            return { logs: [log3] };
          });

        let result = false;

        when(mockedLoggingService.log(deepEqual(logDied))).thenCall(() => {
          result = true;
        });

        service.run();

        expect(result).toEqual(true);
      });
    });
  });
});

const log1 = createFreeLogMessage(interactiveInfo.name, 'took some dmg');

const log2 = createFreeLogMessage(playerInfo.name, 'dodged');

const log3 = createFreeLogMessage(playerInfo.name, 'NOOOO');

const logDied = createActorIsDeadMessage(playerInfo.name);

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);

const eventAttackActor = actionableEvent(actionAttack, actorInfo.id);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

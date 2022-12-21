import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';
import { of, take } from 'rxjs';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { CharacterService } from './character.service';
import { GameRoundService } from './game-round.service';
import { NarrativeService } from './narrative.service';
import { DocumentOpenedInterface } from '../interfaces/reader-dialog.interface';
import { ArrayView } from '../views/array.view';

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
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedRuleDispatcherService,
  mockedSceneEntity,
  setupMocks,
  mockedInteractiveEntity,
  mockedStringMessagesStoreService,
} from '../../../tests/mocks';
import { RuleDispatcherService } from './rule-dispatcher.service';

const actor = instance(mockedActorEntity);

const actor2 = instance(mockedActorEntity2);

const player = instance(mockedPlayerEntity);

const log2 = new LogMessageDefinition('ATTACKED', playerInfo.name, 'logged2');

const logDied = new LogMessageDefinition('DIED', playerInfo.name, 'dead');

describe('GameRoundService', () => {
  let service: GameRoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RuleDispatcherService,
          useValue: instance(mockedRuleDispatcherService),
        },
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createActorIsDeadLogMessage
    ).thenReturn(() => logDied);

    when(mockedActorEntity.action(anything())).thenReturn(eventAttackPlayer);

    when(mockedActorEntity2.action(anything())).thenReturn(eventAttackPlayer);

    when(mockedPlayerEntity.action).thenReturn(() => eventAttackInteractive);

    when(mockedRuleDispatcherService.dispatcher).thenReturn({
      AFFECT: instance(mockedCombatRule),
    });

    when(mockedSceneEntity.interactives).thenReturn(
      ArrayView.create([instance(mockedInteractiveEntity), actor, actor2])
    );

    when(mockedNarrativeService.sceneChanged$).thenReturn(
      of(instance(mockedSceneEntity))
    );

    service = TestBed.inject(GameRoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('run', () => {
    describe('when documentOpened is returned', () => {
      it('should emit documentOpened event', (done) => {
        let result: DocumentOpenedInterface | undefined;

        when(mockedCombatRule.execute(anything(), anything(), anything()))
          .thenReturn({
            documentOpened: documentOpened,
          })
          .thenReturn({});

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
        ).thenReturn({});

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
  });
});

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);

const eventAttackActor = actionableEvent(actionAttack, actorInfo.id);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

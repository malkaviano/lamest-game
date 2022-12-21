import { TestBed } from '@angular/core/testing';

import { anything, instance, when } from 'ts-mockito';
import { of, Subject, take } from 'rxjs';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { CharacterService } from './character.service';
import { GameRoundService } from './game-round.service';
import { NarrativeService } from './narrative.service';
import { DocumentOpenedInterface } from '../interfaces/reader-dialog.interface';
import { ArrayView } from '../views/array.view';
import { RuleDispatcherService } from './rule-dispatcher.service';

import {
  actionableEvent,
  actionAttack,
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

const actor = instance(mockedActorEntity);

const actor2 = instance(mockedActorEntity2);

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

    when(mockedRuleDispatcherService.logMessagePublished$).thenReturn(of());

    when(mockedRuleDispatcherService.actorDodged$).thenReturn(
      of(playerInfo.id)
    );

    when(mockedRuleDispatcherService.documentOpened$).thenReturn(
      documentSubject
    );

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
        when(
          mockedCombatRule.execute(anything(), anything(), anything())
        ).thenReturn();

        let result: DocumentOpenedInterface | undefined;

        service.documentOpened$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        documentSubject.next({
          title: 'Testing',
          text: ArrayView.create(['GG man']),
        });

        service.run();

        done();

        expect(result).toEqual(documentOpened);
      });
    });
  });
});

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

const documentSubject = new Subject<DocumentOpenedInterface>();

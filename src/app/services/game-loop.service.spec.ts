import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';
import { anything, instance, when } from 'ts-mockito';

import {
  createActorIsDeadMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { RulesHelper } from '../helpers/rules.helper';
import { CharacterService } from './character.service';
import { GameLoopService } from './game-loop.service';
import { NarrativeService } from './narrative.service';

import { actionAttack, attackEvent } from '../../../tests/fakes';
import {
  mockedActorEntity,
  mockedCharacterService,
  mockedCombatRule,
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
      ],
    });

    setupMocks();

    when(mockedRulesHelper.combatRule).thenReturn(instance(mockedCombatRule));

    when(mockedCombatRule.execute(anything(), anything(), anything()))
      .thenReturn({
        logs: [log1],
      })
      .thenReturn({
        logs: [log2],
      });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedPlayerEntity)
    );

    when(mockedPlayerEntity.hpChanged$).thenReturn(subject);

    service = TestBed.inject(GameLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('run', () => {
    it('return rule logs', () => {
      when(mockedActorEntity.action).thenReturn(actionAttack);

      when(mockedActorEntity.situation).thenReturn('ALIVE');

      const result = service.run(attackEvent);

      expect(result).toEqual({ logs: [log1, log2] });
    });

    describe('when player HP reaches 0', () => {
      it('should log player died', (done) => {
        subject.next(new HitPointsEvent(10, 0));

        when(mockedActorEntity.situation).thenReturn('DEAD');

        done();

        const result = service.run(attackEvent);

        expect(result).toEqual({ logs: [logDied] });
      });
    });
  });
});

const subject = new Subject<HitPointsEvent>();

const log1 = createFreeLogMessage('test', 'took some dmg');

const log2 = createFreeLogMessage('player', 'dodged');

const logDied = createActorIsDeadMessage('player');

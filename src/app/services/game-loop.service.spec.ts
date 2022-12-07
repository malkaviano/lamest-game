import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import {
  createActorDiedMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { PlayerEntity } from '../entities/player.entity';
import { ActionableEvent } from '../events/actionable.event';
import { HitPointsEvent } from '../events/hitpoints.event';
import { RulesHelper } from '../helpers/rules.helper';
import { CombatRule } from '../rules/combat.rule';
import { CharacterService } from './character.service';
import { GameLoopService } from './game-loop.service';

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
      ],
    });

    when(mockedRulesHelper.combatRule).thenReturn(instance(mockedCombatRule));

    when(
      mockedCombatRule.execute(anything(), anything(), anything())
    ).thenReturn({
      logs: [log1],
    });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedCharacterEntity.hpChanged$).thenReturn(subject);

    service = TestBed.inject(GameLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('run', () => {
    it('return logs', () => {
      const result = service.run(event);

      expect(result).toEqual({ logs: [log1, log2] });
    });

    describe('when player HP reaches 0', () => {
      it('should log player died', (done) => {
        subject.next(new HitPointsEvent(10, 0));

        done();

        const result = service.run(event);

        expect(result).toEqual({ logs: [logDied] });
      });
    });
  });
});

const action = createActionableDefinition('ATTACK', 'attack', 'Attack');

const event = new ActionableEvent(action, 'id1');

const mockedRulesHelper = mock(RulesHelper);

const mockedCombatRule = mock(CombatRule);

const mockedCharacterService = mock(CharacterService);

const mockedCharacterEntity = mock(PlayerEntity);

const subject = new Subject<HitPointsEvent>();

const log1 = createFreeLogMessage('me', 'GG brah');

const log2 = createFreeLogMessage('me', 'Sure, took a while');

const logDied = createActorDiedMessage('player');

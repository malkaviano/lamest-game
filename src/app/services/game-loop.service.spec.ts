import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import {
  createActorDiedMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ActionableEvent } from '../events/actionable.event';
import { HitPointsEvent } from '../events/hitpoints.event';
import { RulesHelper } from '../helpers/rules.helper';
import { AttackRule } from '../rules/attack.rule';
import { DefenseRule } from '../rules/defense.rule';
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

    when(mockedRulesHelper.attackRule).thenReturn(instance(mockedAttackRule));

    when(mockedRulesHelper.defenseRule).thenReturn(instance(mockedDefenseRule));

    when(mockedAttackRule.execute(anything())).thenReturn({
      logs: [log1],
    });

    when(mockedDefenseRule.execute()).thenReturn({
      logs: [log2],
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

const mockedAttackRule = mock(AttackRule);

const mockedDefenseRule = mock(DefenseRule);

const mockedCharacterService = mock(CharacterService);

const mockedCharacterEntity = mock(CharacterEntity);

const subject = new Subject<HitPointsEvent>();

const log1 = createFreeLogMessage('me', 'GG brah');

const log2 = createFreeLogMessage('me', 'Sure, took a while');

const logDied = createActorDiedMessage('player');

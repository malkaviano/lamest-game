import { TestBed } from '@angular/core/testing';

import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { PlayerEntity } from '../entities/player.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';

describe('SkillRule', () => {
  let service: SkillRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollRule),
        },
      ],
    });

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    when(mockedInteractiveEntity.reactTo(anything(), anything())).thenReturn(
      'destroyed by xpto'
    );

    service = TestBed.inject(SkillRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when skill has no value', () => {
      it('return SKILL CANNOT BE ROLLED', () => {
        when(mockedCharacterEntity.skills).thenReturn({});

        when(
          mockedRollRule.actorSkillCheck(
            instance(mockedCharacterEntity),
            'Brawl'
          )
        ).thenReturn({
          result: 'IMPOSSIBLE',
          roll: 0,
        });

        const result = service.execute(
          instance(mockedCharacterEntity),
          event,
          instance(mockedInteractiveEntity)
        );

        expect(result).toEqual({
          logs: [log2],
        });
      });
    });

    it('return logs', () => {
      when(mockedCharacterEntity.skills).thenReturn({ Brawl: 45 });

      when(
        mockedRollRule.actorSkillCheck(instance(mockedCharacterEntity), 'Brawl')
      ).thenReturn({
        result: 'SUCCESS',
        roll: 10,
      });

      const result = service.execute(
        instance(mockedCharacterEntity),
        event,
        instance(mockedInteractiveEntity)
      );

      expect(result).toEqual({
        logs: [log1, log3],
      });
    });
  });
});

const mockedRollRule = mock(RollService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const mockedCharacterEntity = mock(PlayerEntity);

const action = createActionableDefinition('SKILL', 'Brawl');

const event = new ActionableEvent(action, 'id1');

const log1 = createCheckLogMessage('player', 'Brawl', 10, 'SUCCESS');

const log2 = createCannotCheckLogMessage('player', 'Brawl');

const log3 = createFreeLogMessage('test', 'destroyed by xpto');

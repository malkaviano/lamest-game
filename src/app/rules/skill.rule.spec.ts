import { TestBed } from '@angular/core/testing';

import { anything, instance, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollService,
  setupMocks,
} from '../../../tests/mocks';

describe('SkillRule', () => {
  let service: SkillRule;

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
        when(mockedPlayerEntity.skills).thenReturn({});

        when(
          mockedRollService.actorSkillCheck(
            instance(mockedPlayerEntity),
            'Brawl'
          )
        ).thenReturn({
          result: 'IMPOSSIBLE',
          roll: 0,
        });

        const result = service.execute(
          instance(mockedPlayerEntity),
          event,
          instance(mockedInteractiveEntity)
        );

        expect(result).toEqual({
          logs: [log2],
        });
      });
    });

    it('return logs', () => {
      when(mockedPlayerEntity.skills).thenReturn({ Brawl: 45 });

      when(
        mockedRollService.actorSkillCheck(instance(mockedPlayerEntity), 'Brawl')
      ).thenReturn({
        result: 'SUCCESS',
        roll: 10,
      });

      const result = service.execute(
        instance(mockedPlayerEntity),
        event,
        instance(mockedInteractiveEntity)
      );

      expect(result).toEqual({
        logs: [log1, log3],
      });
    });
  });
});

const action = createActionableDefinition('SKILL', 'Brawl');

const event = new ActionableEvent(action, 'id1');

const log1 = createCheckLogMessage('player', 'Brawl', 10, 'SUCCESS');

const log2 = createCannotCheckLogMessage('player', 'Brawl');

const log3 = createFreeLogMessage('test', 'destroyed by xpto');

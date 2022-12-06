import { TestBed } from '@angular/core/testing';

import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { CharacterEntity } from '../entities/character.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';

describe('SkillRule', () => {
  let service: SkillRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: RollService,
          useValue: instance(mockedRollRule),
        },
      ],
    });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    when(
      mockedInteractiveEntity.actionSelected(anything(), anything())
    ).thenReturn('destroyed by xpto');

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

        const result = service.execute(event);

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

      const result = service.execute(event);

      expect(result).toEqual({
        logs: [log1, log3],
      });
    });
  });
});

const mockedCharacterService = mock(CharacterService);

const mockedRollRule = mock(RollService);

const mockedNarrativeService = mock(NarrativeService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};

const mockedCharacterEntity = mock(CharacterEntity);

const action = createActionableDefinition('SKILL', 'Brawl');

const event = new ActionableEvent(action, 'id1');

const log1 = createCheckLogMessage('player', 'Brawl', 10, 'SUCCESS');

const log2 = createCannotCheckLogMessage('player', 'Brawl');

const log3 = createFreeLogMessage('test', 'destroyed by xpto');

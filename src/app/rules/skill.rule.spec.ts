import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createCheckLogMessage } from '../definitions/log-message.definition';
import { CharacterEntity } from '../entities/character.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';
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
          provide: RandomIntService,
          useValue: instance(mockedRngService),
        },
      ],
    });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedCharacterEntity.skills).thenReturn({ Brawl: 45 });

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(SkillRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(mockedCharacterEntity.skills).thenReturn({ Brawl: 45 });

      when(mockedRngService.checkSkill(45)).thenReturn({
        result: 'SUCCESS',
        roll: 10,
      });

      const result = service.execute(event);

      expect(result).toEqual({
        logs: [log1],
      });
    });
  });
});

const mockedCharacterService = mock(CharacterService);

const mockedRngService = mock(RandomIntService);

const mockedNarrativeService = mock(NarrativeService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};

const mockedCharacterEntity = mock(CharacterEntity);

const action = createActionableDefinition('SKILL', 'Brawl');

const event = new ActionableEvent(action, 'id1');

const log1 = createCheckLogMessage('player', 'Brawl', 10, 'SUCCESS');

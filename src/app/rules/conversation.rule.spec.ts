import { TestBed } from '@angular/core/testing';

import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { ConversationRule } from './conversation.rule';

describe('ConversationRule', () => {
  let service: ConversationRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(ConversationRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('logs answer', () => {
      when(
        mockedInteractiveEntity.actionSelected(anything(), 'NONE')
      ).thenReturn('Hello');

      const result = service.execute(
        new ActionableEvent(
          createActionableDefinition('ASK', 'hi', 'Hi'),
          'id1'
        )
      );

      expect(result).toEqual({
        logs: ['player: Hi', 'test: Hello'],
      });
    });
  });
});

const mockedNarrativeService = mock(NarrativeService);

const mockedLoggingService = mock(LoggingService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};

import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';

import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { ConversationState } from '../states/conversation.state';
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

    service = TestBed.inject(ConversationRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('logs answer', () => {
      let result: string[] = [];

      when(mockedLoggingService.log('player: Hi')).thenCall(() =>
        result.push('ok')
      );

      when(mockedLoggingService.log('test: Hello')).thenCall(() =>
        result.push('ok')
      );

      service.execute(
        new ActionableEvent(createActionableDefinition('ASK', 'hi', 'Hi'), 'i1')
      );

      expect(result).toEqual(['ok', 'ok']);
    });
  });
});

const mockedNarrativeService = mock(NarrativeService);

const mockedLoggingService = mock(LoggingService);

const interactives: KeyValueInterface<InteractiveEntity> = {
  i1: new InteractiveEntity(
    'i1',
    'test',
    'test',
    new ConversationState(
      {
        oi: {
          hi: {
            label: 'Hi',
            answer: 'Hello',
          },
        },
      },
      'oi'
    )
  ),
};

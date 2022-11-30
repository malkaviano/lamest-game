import { TestBed } from '@angular/core/testing';

import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createFreeLogMessage } from '../definitions/log-message.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
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
    it('return logs', () => {
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
        logs: [log1, log2],
      });
    });
  });
});

const mockedNarrativeService = mock(NarrativeService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};

const log1 = createFreeLogMessage('player', 'Hi');

const log2 = createFreeLogMessage('test', 'Hello');

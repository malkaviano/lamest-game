import { TestBed } from '@angular/core/testing';

import { anything, instance, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createFreeLogMessage } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ConversationRule } from './conversation.rule';

import {
  mockedInteractiveEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';

describe('ConversationRule', () => {
  let service: ConversationRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    setupMocks();

    service = TestBed.inject(ConversationRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(mockedInteractiveEntity.reactTo(anything(), 'NONE')).thenReturn(
        'Hello'
      );

      const result = service.execute(
        instance(mockedPlayerEntity),
        new ActionableEvent(
          createActionableDefinition('ASK', 'hi', 'Hi'),
          'id1'
        ),
        instance(mockedInteractiveEntity)
      );

      expect(result).toEqual({
        logs: [log1, log2],
      });
    });
  });
});

const log1 = createFreeLogMessage('player', 'Hi');

const log2 = createFreeLogMessage('test', 'Hello');

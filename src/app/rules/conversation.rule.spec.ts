import { TestBed } from '@angular/core/testing';

import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createFreeLogMessage } from '../definitions/log-message.definition';
import { PlayerEntity } from '../entities/player.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { ConversationRule } from './conversation.rule';

describe('ConversationRule', () => {
  let service: ConversationRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    when(mockedCharacterEntity.name).thenReturn('player');

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
        instance(mockedCharacterEntity),
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

const mockedCharacterEntity = mock(PlayerEntity);

const mockedInteractiveEntity = mock(InteractiveEntity);

const log1 = createFreeLogMessage('player', 'Hi');

const log2 = createFreeLogMessage('test', 'Hello');

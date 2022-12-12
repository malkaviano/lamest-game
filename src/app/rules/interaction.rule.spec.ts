import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createFreeLogMessage } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InteractionRule } from './interaction.rule';

import {
  mockedInteractiveEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';

describe('InteractionRule', () => {
  let service: InteractionRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    setupMocks();

    service = TestBed.inject(InteractionRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(
        mockedInteractiveEntity.reactTo(anything(), 'NONE', deepEqual({}))
      ).thenReturn('Hello');

      const result = service.execute(
        instance(mockedPlayerEntity),
        new ActionableEvent(
          createActionableDefinition('INTERACTION', 'hi', 'Hi'),
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

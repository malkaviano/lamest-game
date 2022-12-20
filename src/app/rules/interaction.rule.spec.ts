import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';

import { ExtractorHelper } from '../helpers/extractor.helper';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InteractionRule } from './interaction.rule';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import { interactiveInfo, playerInfo } from '../../../tests/fakes';

describe('InteractionRule', () => {
  let service: InteractionRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'INSPECTED',
        playerInfo.name,
        'Hi'
      )
    ).thenReturn(log1);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'INSPECTED',
        interactiveInfo.name,
        'Hello'
      )
    ).thenReturn(log2);

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
        { target: instance(mockedInteractiveEntity) }
      );

      expect(result).toEqual({
        logs: [log1, log2],
      });
    });
  });
});

const log1 = new LogMessageDefinition('INSPECTED', playerInfo.name, 'Hi');

const log2 = new LogMessageDefinition(
  'INSPECTED',
  interactiveInfo.name,
  'Hello'
);

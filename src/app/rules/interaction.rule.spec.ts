import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, when } from 'ts-mockito';

import { ExtractorHelper } from '../helpers/extractor-target.helper';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { createFreeLogMessage } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InteractionRule } from './interaction.rule';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedPlayerEntity,
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
      ],
    });

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
        { target: instance(mockedInteractiveEntity) }
      );

      expect(result).toEqual({
        logs: [log1, log2],
      });
    });
  });
});

const log1 = createFreeLogMessage(playerInfo.name, 'Hi');

const log2 = createFreeLogMessage(interactiveInfo.name, 'Hello');

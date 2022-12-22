import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { ExtractorHelper } from '../helpers/extractor.helper';
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
import {
  interactiveInfo,
  playerInfo,
  actionableEvent,
  actionInspect,
  readable,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

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

    service = TestBed.inject(InteractionRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should log item inspected', () => {
      when(
        mockedInteractiveEntity.reactTo(
          eventInspect.actionableDefinition,
          'NONE',
          deepEqual({})
        )
      ).thenReturn(inspectedMessage);

      when(
        mockedStringMessagesStoreService.createFreeLogMessage(
          'INTERACTED',
          playerInfo.name,
          eventInspect.actionableDefinition.label
        )
      ).thenReturn(inspectActionLog);

      when(
        mockedStringMessagesStoreService.createFreeLogMessage(
          'INTERACTED',
          interactiveInfo.name,
          inspectedMessage
        )
      ).thenReturn(inspectedLog);

      ruleScenario(service, actor, eventInspect, extras, [
        inspectActionLog,
        inspectedLog,
      ]);
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const extras = {
  target,
};

const eventInspect = actionableEvent(actionInspect, readable.identity.name);

const inspectedMessage = 'inspected';

const inspectActionLog = new LogMessageDefinition(
  'INTERACTED',
  playerInfo.name,
  'Inspect'
);

const inspectedLog = new LogMessageDefinition(
  'INTERACTED',
  interactiveInfo.name,
  'Documented read'
);

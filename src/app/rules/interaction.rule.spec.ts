import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { CheckedHelper } from '../helpers/checked.helper';
import { InteractionRule } from './interaction.rule';

import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedPlayerEntity,
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
          provide: CheckedHelper,
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
    it('should log item inspected', (done) => {
      when(
        mockedInteractiveEntity.reactTo(
          eventInspect.actionableDefinition,
          'NONE',
          deepEqual({})
        )
      ).thenReturn(inspectedMessage);

      ruleScenario(
        service,
        actor,
        eventInspect,
        extras,
        [inspectActionLog, inspectedLog],
        done
      );
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
  'inspected'
);

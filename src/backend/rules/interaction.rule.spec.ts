import { deepEqual, instance, when } from 'ts-mockito';

import { InteractionRule } from './interaction.rule';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';

import {
  mockedCheckedService,
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
  const rule = new InteractionRule(instance(mockedCheckedService));

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
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
        rule,
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

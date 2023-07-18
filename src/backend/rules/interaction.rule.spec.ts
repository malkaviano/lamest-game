import { deepEqual, instance, when } from 'ts-mockito';

import { InteractionRule } from '@rules/interaction.rule';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RuleResult } from '@results/rule.result';

import {
  mockedCheckedService,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { playerInfo, actionableEvent, actionAsk } from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('InteractionRule', () => {
  let rule: InteractionRule;

  beforeEach(() => {
    setupMocks();

    rule = new InteractionRule(instance(mockedCheckedService));
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    it('should log item inspected', (done) => {
      when(
        mockedInteractiveEntity.reactTo(
          eventInteraction.actionableDefinition,
          'NONE',
          deepEqual({})
        )
      ).thenReturn(null);

      ruleScenario(
        rule,
        actor,
        eventInteraction,
        extras,
        [interactionActionLog],
        done
      );
    });

    it('return interaction result', () => {
      const result = rule.execute(actor, eventInteraction, extras);

      const expected: RuleResult = {
        name: 'INTERACTION',
        event: eventInteraction,
        actor,
        result: 'EXECUTED',
        target: extras.target,
      };

      expect(result).toEqual(expected);
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const extras = {
  target,
};

const eventInteraction = actionableEvent(actionAsk, 'someId');

const interactionActionLog = new LogMessageDefinition(
  'INTERACTED',
  playerInfo.name,
  'Got action?'
);

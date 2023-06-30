import { deepEqual, instance, when } from 'ts-mockito';

import { InteractionRule } from './interaction.rule';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

import {
  mockedAffectedAxiom,
  mockedCheckedService,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { playerInfo, actionableEvent, actionAsk } from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('InteractionRule', () => {
  const rule = new InteractionRule(
    instance(mockedCheckedService),
    instance(mockedAffectedAxiom)
  );

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

      const expected: RuleResultInterface = {
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

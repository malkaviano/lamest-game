import { LogMessageDefinition } from '../src/conceptual/definitions/log-message.definition';
import { ActionableEvent } from '../src/conceptual/events/actionable.event';
import { ActorInterface } from '../src/conceptual/interfaces/actor.interface';
import { RuleExtrasInterface } from '../src/conceptual/interfaces/rule-extras.interface';
import { MasterRule } from '../src/backend/rules/master.rule';

export const ruleScenario = (
  service: MasterRule,
  actor: ActorInterface,
  actionableEvent: ActionableEvent,
  extras: RuleExtrasInterface,
  expected: LogMessageDefinition[],
  done: () => void
) => {
  const result: LogMessageDefinition[] = [];

  service.logMessageProduced$.subscribe((event) => {
    result.push(event);
  });

  service.execute(actor, actionableEvent, extras);

  done();

  expect(result).toEqual(expected);
};

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleAbstraction } from '../src/conceptual/abstractions/rule.abstraction';

export const ruleScenario = (
  service: RuleAbstraction,
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

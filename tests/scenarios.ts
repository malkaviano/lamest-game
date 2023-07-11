import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';

export const ruleScenario = (
  service: RuleAbstraction,
  actor: ActorInterface,
  actionableEvent: ActionableEvent,
  extras: RuleExtrasInterface,
  expected: LogMessageDefinition[],
  done: DoneFn
) => {
  const result: LogMessageDefinition[] = [];

  service.logMessageProduced$.subscribe((event) => {
    result.push(event);
  });

  done();

  service.execute(actor, actionableEvent, extras);

  expect(result).toEqual(expected);
};

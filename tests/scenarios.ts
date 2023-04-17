import { LogMessageDefinition } from '../src/core/definitions/log-message.definition';
import { ActionableEvent } from '../src/core/events/actionable.event';
import { ActorInterface } from '../src/core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../src/core/interfaces/rule-extras.interface';
import { MasterRuleService } from '../src/backend/rules/master.rule';

export const ruleScenario = (
  service: MasterRuleService,
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

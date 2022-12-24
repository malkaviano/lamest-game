import { LogMessageDefinition } from '../src/app/definitions/log-message.definition';
import { ActionableEvent } from '../src/app/events/actionable.event';
import { ActorInterface } from '../src/app/interfaces/actor.interface';
import { RuleExtrasInterface } from '../src/app/interfaces/rule-extras.interface';
import { MasterRuleService } from '../src/app/rules/master.rule';

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

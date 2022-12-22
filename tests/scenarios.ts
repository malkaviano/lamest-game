import { take } from 'rxjs';

import { LogMessageDefinition } from '../src/app/definitions/log-message.definition';
import { ActionableEvent } from '../src/app/events/actionable.event';
import { ActorInterface } from '../src/app/interfaces/actor.interface';
import { RuleExtrasInterface } from '../src/app/interfaces/rule-extras.interface';
import { MasterRuleService } from '../src/app/rules/master.rule.service';

export const ruleScenario = (
  service: MasterRuleService,
  actor: ActorInterface,
  actionableEvent: ActionableEvent,
  extras: RuleExtrasInterface,
  expected: LogMessageDefinition[]
) => {
  const result: LogMessageDefinition[] = [];

  service.ruleLog$.pipe(take(100)).subscribe((event) => {
    result.push(event);
  });

  service.execute(actor, actionableEvent, extras);

  expect(result).toEqual(expected);
};

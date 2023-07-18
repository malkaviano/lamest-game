import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValuesDefinition } from '@definitions/rule-values.definition';
import { RuleResult } from '@results/rule.result';

export interface RuleInterface {
  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleValuesDefinition
  ): RuleResult;
}

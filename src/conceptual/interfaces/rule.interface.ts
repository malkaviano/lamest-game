import { ActionableEvent } from '@conceptual/events/actionable.event';
import { ActorInterface } from './actor.interface';
import { RuleExtrasInterface } from './rule-extras.interface';
import { RuleResultInterface } from './rule-result.interface';

export interface RuleInterface {
  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface;
}

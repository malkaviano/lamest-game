import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from './actor.interface';
import { RuleExtrasInterface } from './rule-extras.interface';

export interface RuleInterface {
  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void;
}

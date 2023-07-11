import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

export interface RuleInterface {
  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface;
}

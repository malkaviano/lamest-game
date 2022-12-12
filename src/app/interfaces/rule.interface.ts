import { ActionableEvent } from '../events/actionable.event';
import { ActionReactive } from './action-reactive.interface';
import { ActorInterface } from './actor.interface';
import { RuleResultInterface } from './rule-result.interface';

export interface RuleInterface {
  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    target?: ActionReactive
  ): RuleResultInterface;
}

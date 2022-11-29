import { ActionableEvent } from '../events/actionable.event';
import { RuleResultInterface } from './rule-result.interface';

export interface RuleInterface {
  execute(action: ActionableEvent): RuleResultInterface;
}

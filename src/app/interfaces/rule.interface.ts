import { ActionableEvent } from '../events/actionable.event';
import { RuleResult } from '../results/rule.result';

export interface RuleInterface {
  execute(action: ActionableEvent): RuleResult;
}

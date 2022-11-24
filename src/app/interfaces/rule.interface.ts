import { ActionableEvent } from '../events/actionable.event';

export interface RuleInterface {
  execute(action: ActionableEvent): void;
}

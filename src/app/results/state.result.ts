import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionLogDefinition } from '../definitions/action-log.definition';
import { ActionableState } from '../states/actionable.state';

export class StateResult {
  constructor(
    public readonly state: ActionableState,
    public readonly log: ActionLogDefinition
  ) {}
}

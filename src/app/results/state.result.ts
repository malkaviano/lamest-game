import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionLogDefinition } from '../definitions/action-log.definition';
import { InteractiveState } from '../states/interactive.state';

export class StateResult {
  constructor(
    public readonly state: InteractiveState,
    public readonly log: ActionLogDefinition
  ) {}
}

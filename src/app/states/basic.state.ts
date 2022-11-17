import { ActionableDefinition } from '../definitions/actionable.definition';
import { LogMessage } from '../definitions/log-message.definition';
import { StateResult } from '../results/state.result';
import { InteractiveState } from './interactive.state';

export class BasicState extends InteractiveState {
  constructor(entityId: string, stateActions: ActionableDefinition[]) {
    super(entityId, 'BasicState', stateActions);
  }

  protected stateResult(action: ActionableDefinition): {
    state: InteractiveState;
    log: LogMessage;
  } {
    return new StateResult(this, new LogMessage(action, 'executed'));
  }
}

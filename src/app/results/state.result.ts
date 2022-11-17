import { LogMessage } from '../definitions/log-message.definition';
import { InteractiveState } from '../states/interactive.state';

export class StateResult {
  constructor(
    public readonly state: InteractiveState,
    public readonly log: LogMessage
  ) {}
}

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { LogMessage } from '../definitions/log-message.definition';
import { StateLiteral } from '../literals/state.literal';

export abstract class InteractiveState {
  constructor(
    public readonly entityId: string,
    public readonly name: StateLiteral,
    protected stateActions: ActionableDefinition[]
  ) {}

  public get actions(): ArrayView<ActionableDefinition> {
    return new ArrayView(this.stateActions);
  }

  public abstract execute(action: ActionableDefinition): {
    state: InteractiveState;
    log: LogMessage;
  };
}

import { Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { LogMessage } from '../definitions/log-message.definition';
import { StateLiteral } from '../literals/state.literal';

export abstract class InteractiveState {
  protected readonly logMessageProduced: Subject<LogMessage>;
  public logMessageProduced$: Observable<LogMessage>;

  constructor(
    public readonly entityId: string,
    public readonly name: StateLiteral,
    protected stateActions: ActionableDefinition[]
  ) {
    this.logMessageProduced = new Subject<LogMessage>();
    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public get actions(): ArrayView<ActionableDefinition> {
    return new ArrayView(this.stateActions);
  }

  public abstract execute(action: ActionableDefinition): InteractiveState;
}

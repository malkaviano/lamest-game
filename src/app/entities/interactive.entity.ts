import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { LogMessage } from '../definitions/log-message.definition';
import { InteractiveState } from '../states/interactive.state';

export class InteractiveEntity {
  protected readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;
  protected readonly logMessageProduced: Subject<LogMessage>;

  public readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;
  public readonly logMessageProduced$: Observable<LogMessage>;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    protected currentState: InteractiveState
  ) {
    this.actionsChanged = new BehaviorSubject<ArrayView<ActionableDefinition>>(
      this.currentState.actions
    );

    this.actionsChanged$ = this.actionsChanged.asObservable();

    this.logMessageProduced = new Subject<LogMessage>();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public onActionSelected(actionableDefinition: ActionableDefinition): void {
    const oldActions = this.currentState.actions;

    const { state, log } = this.currentState.execute(actionableDefinition);

    this.currentState = state;

    const currentActions = this.currentState.actions;

    this.logMessageProduced.next(log);

    if (!oldActions.equals(currentActions)) {
      this.actionsChanged.next(currentActions);
    }
  }
}

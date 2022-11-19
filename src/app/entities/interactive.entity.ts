import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from '../states/actionable.state';

export class InteractiveEntity {
  protected readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;

  public readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    protected currentState: ActionableState
  ) {
    this.actionsChanged = new BehaviorSubject<ArrayView<ActionableDefinition>>(
      this.currentState.actions
    );

    this.actionsChanged$ = this.actionsChanged.asObservable();
  }

  public onActionSelected(action: ActionableDefinition): void {
    const oldActions = this.currentState.actions;

    const state = this.currentState.execute(action);

    this.currentState = state;

    const currentActions = this.currentState.actions;

    if (!oldActions.equals(currentActions)) {
      this.actionsChanged.next(currentActions);
    }
  }
}

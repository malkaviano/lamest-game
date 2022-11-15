import { BehaviorSubject, Observable } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { InteractiveState } from '../states/interactive.state';

export class InteractiveEntity {
  protected readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;
  public actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

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
  }

  public onActionSelected(actionableDefinition: ActionableDefinition): void {
    const oldActions = this.currentState.actions;

    this.currentState = this.currentState.execute(actionableDefinition);

    const currentActions = this.currentState.actions;

    if (!oldActions.equals(currentActions)) {
      this.actionsChanged.next(currentActions);
    }
  }
}

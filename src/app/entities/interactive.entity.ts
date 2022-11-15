import { BehaviorSubject, Observable } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { InteractiveState } from '../states/interactive.state';

export class InteractiveEntity {
  protected readonly stateChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;
  public stateChanged$: Observable<ArrayView<ActionableDefinition>>;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    protected currentState: InteractiveState
  ) {
    this.stateChanged = new BehaviorSubject<ArrayView<ActionableDefinition>>(
      this.currentState.actions
    );
    this.stateChanged$ = this.stateChanged.asObservable();
  }

  public onActionSelected(actionableDefinition: ActionableDefinition): void {
    this.currentState = this.currentState.execute(actionableDefinition);

    this.stateChanged.next(this.currentState.actions);
  }
}

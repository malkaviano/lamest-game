import { BehaviorSubject, Observable } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from '../states/actionable.state';
import { ResultLiteral } from '../literals/result.literal';

export class InteractiveEntity {
  private readonly initialState: ActionableState;

  private readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;

  public readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    private currentState: ActionableState,
    private readonly resettable: boolean = true
  ) {
    this.initialState = this.currentState;

    this.actionsChanged = new BehaviorSubject<ArrayView<ActionableDefinition>>(
      this.currentState.actions
    );

    this.actionsChanged$ = this.actionsChanged.asObservable();
  }

  public actionSelected(
    selected: ActionableDefinition,
    result: ResultLiteral,
    damageTaken?: number
  ): void {
    const oldActions = this.currentState.actions;

    this.currentState = this.currentState.onResult(
      selected,
      result,
      damageTaken
    );

    const currentActions = this.currentState.actions;

    if (!oldActions.equals(currentActions)) {
      this.actionsChanged.next(currentActions);
    }
  }

  public reset(): void {
    if (this.resettable) {
      this.currentState = this.initialState;

      this.actionsChanged.next(this.currentState.actions);
    }
  }
}

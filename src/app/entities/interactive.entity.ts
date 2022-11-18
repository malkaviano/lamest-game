import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { InteractiveLogDefinition } from '../definitions/interactive-log.definition';
import { ActionableState } from '../states/actionable.state';

export class InteractiveEntity {
  protected readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;
  protected readonly actionResult: Subject<InteractiveLogDefinition>;
  protected readonly actionSelected: Subject<ActionableDefinition>;

  public readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;
  public readonly actionResult$: Observable<InteractiveLogDefinition>;
  public readonly actionSelected$: Observable<ActionableDefinition>;

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

    this.actionResult = new Subject<InteractiveLogDefinition>();

    this.actionResult$ = this.actionResult.asObservable();

    this.actionSelected = new Subject<ActionableDefinition>();

    this.actionSelected$ = this.actionSelected.asObservable();
  }

  public onActionSelected(action: ActionableDefinition): void {
    const oldActions = this.currentState.actions;

    const { state, log } = this.currentState.execute(action);

    this.currentState = state;

    const currentActions = this.currentState.actions;

    this.actionResult.next(new InteractiveLogDefinition(this.name, log));

    this.actionSelected.next(action);

    if (!oldActions.equals(currentActions)) {
      this.actionsChanged.next(currentActions);
    }
  }
}

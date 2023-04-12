import { BehaviorSubject, Observable } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../model-views/array.view';
import { ActionableState } from '../states/actionable.state';
import { ResultLiteral } from '../literals/result.literal';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { ClassificationLiteral } from '../literals/classification.literal';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';

export class InteractiveEntity implements ActionReactiveInterface {
  private readonly initialState: ActionableState;

  private readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;

  public readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    protected currentState: ActionableState,
    protected readonly resettable: boolean
  ) {
    this.initialState = this.currentState;

    this.actionsChanged = new BehaviorSubject<ArrayView<ActionableDefinition>>(
      this.currentState.actions
    );

    this.actionsChanged$ = this.actionsChanged.asObservable();
  }

  public get classification(): ClassificationLiteral {
    return 'REACTIVE';
  }

  public reactTo(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): string | null {
    const oldActions = this.currentState.actions;

    const { state, log } = this.currentState.onResult(action, result, values);

    this.currentState = state;

    const currentActions = this.currentState.actions;

    this.publish(oldActions, currentActions);

    return log ?? null;
  }

  protected publish(
    oldActions: ArrayView<ActionableDefinition>,
    currentActions: ArrayView<ActionableDefinition>
  ) {
    if (
      JSON.stringify(oldActions.items) !== JSON.stringify(currentActions.items)
    ) {
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

import { BehaviorSubject, Observable } from 'rxjs';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActionableState } from '@states/actionable.state';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ClassificationLiteral } from '@literals/classification.literal';
import { ReactionValuesDefinition } from '@definitions/reaction-values.definition';
import { ArrayView } from '@wrappers/array.view';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';

export class InteractiveEntity implements InteractiveInterface {
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

  public get ignores(): ArrayView<VisibilityLiteral> {
    return ArrayView.empty<VisibilityLiteral>();
  }

  public get behavior(): BehaviorLiteral {
    return 'PASSIVE';
  }

  public get classification(): ClassificationLiteral {
    return 'REACTIVE';
  }

  public reactTo(
    action: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValuesDefinition
  ): string | null {
    const oldActions = this.currentState.actions;

    const { state, log } = this.currentState.onResult(action, result, values);

    this.currentState = state;

    const currentActions = this.currentState.actions;

    this.publish(oldActions, currentActions);

    return log ?? null;
  }

  public reset(): void {
    if (this.resettable) {
      this.currentState = this.initialState;

      this.actionsChanged.next(this.currentState.actions);
    }
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
}

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActionableState } from '@states/actionable.state';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ClassificationLiteral } from '@literals/classification.literal';
import { ReactionValues } from '@values/reaction.value';
import { ArrayView } from '@wrappers/array.view';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';

export class InteractiveEntity implements InteractiveInterface {
  private readonly initialState: ActionableState;

  private readonly actionsChanged: BehaviorSubject<
    ArrayView<ActionableDefinition>
  >;

  private readonly visibilityChanged: Subject<VisibilityLiteral>;

  protected mVisibility: VisibilityLiteral;

  public readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

  public readonly visibilityChanged$: Observable<VisibilityLiteral>;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    protected currentState: ActionableState,
    protected readonly resettable: boolean,
    visibility: VisibilityLiteral
  ) {
    this.initialState = this.currentState;

    this.actionsChanged = new BehaviorSubject<ArrayView<ActionableDefinition>>(
      this.currentState.actions
    );

    this.actionsChanged$ = this.actionsChanged.asObservable();

    this.mVisibility = visibility;

    this.visibilityChanged = new Subject();

    this.visibilityChanged$ = this.visibilityChanged.asObservable();
  }

  public get visibility(): VisibilityLiteral {
    return this.mVisibility;
  }

  public changeVisibility(visibility: VisibilityLiteral): void {
    if (visibility !== this.visibility) {
      this.mVisibility = visibility;

      this.visibilityChanged.next(this.visibility);
    }
  }

  public get actions(): ArrayView<ActionableDefinition> {
    return this.currentState.actions;
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
    values: ReactionValues
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

import { ActionableDefinition } from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { VisibilityLiteral } from '../literals/visibility.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';

export class VisibilityState extends ActionableState {
  constructor(
    stateAction: ActionableDefinition,
    private readonly maximumTries: number
  ) {
    super('VisibilityState', ArrayView.create([stateAction]));
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string } {
    const actor = values.actorVisibility;

    if (!actor) {
      throw new Error(errorMessages['INVALID-OPERATION']);
    }

    switch (result) {
      case 'SUCCESS':
        actor.visibility = this.visibility(action.name);

        return { state: emptyState };
      case 'FAILURE':
        return {
          state:
            this.maximumTries - 1 > 0
              ? new VisibilityState(
                  this.stateActions.items[0],
                  this.maximumTries - 1
                )
              : emptyState,
        };
      default:
        return { state: this };
    }
  }

  private visibility(skillName: string): VisibilityLiteral {
    if (skillName === 'Disguise') {
      return 'DISGUISED';
    }

    if (skillName === 'Hide') {
      return 'HIDDEN';
    }

    return 'VISIBLE';
  }
}

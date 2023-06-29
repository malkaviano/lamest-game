import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';
import { ArrayView } from '../view-models/array.view';
import { LazyHelper } from '../helpers/lazy.helper';
import { CheckResultLiteral } from '../literals/check-result.literal';

export class SkillState extends ActionableState {
  constructor(
    stateAction: ActionableDefinition,
    private readonly successState: LazyHelper<ActionableState>,
    private readonly maximumTries: number
  ) {
    super('SkillState', ArrayView.create([stateAction]));
  }

  protected override stateResult(
    _1: ActionableDefinition,
    result: CheckResultLiteral
  ): { state: ActionableState; log?: string } {
    switch (result) {
      case 'SUCCESS':
        return { state: this.successState.value };
      case 'FAILURE':
        return {
          state:
            this.maximumTries - 1 > 0
              ? this.clone(this.maximumTries - 1)
              : emptyState,
        };
      default:
        return { state: this };
    }
  }

  private clone(maximumTries: number): SkillState {
    return new SkillState(
      this.stateActions.items[0],
      this.successState,
      maximumTries
    );
  }
}

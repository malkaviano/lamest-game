import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';

export class SkillState extends ActionableState {
  constructor(
    stateAction: ActionableDefinition,
    private readonly successState: () => ActionableState,
    private readonly maximumTries: number
  ) {
    super('SkillState', new ArrayView([stateAction]));
  }

  protected override stateResult(
    _1: ActionableDefinition,
    result: ResultLiteral
  ): { state: ActionableState; log?: string } {
    switch (result) {
      case 'SUCCESS':
        return { state: this.successState() };
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

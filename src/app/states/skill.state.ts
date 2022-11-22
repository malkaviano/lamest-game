import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';

export class SkillState extends ActionableState {
  constructor(
    stateAction: ActionableDefinition,
    private readonly successState: ActionableState,
    private readonly maximumTries: number
  ) {
    super('SkillState', [stateAction]);
  }

  protected override stateResult(
    _1: ActionableDefinition,
    result: ResultLiteral
  ): ActionableState {
    switch (result) {
      case 'SUCCESS':
        return this.successState;
      case 'FAILURE':
        return this.maximumTries - 1 > 0
          ? this.clone(this.maximumTries - 1)
          : emptyState;
      default:
        return this;
    }
  }

  private clone(maximumTries: number): SkillState {
    return new SkillState(
      this.stateActions[0],
      this.successState,
      maximumTries
    );
  }
}

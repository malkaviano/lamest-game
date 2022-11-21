import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';

export class SkillState extends ActionableState {
  constructor(
    entityId: string,
    stateAction: ActionableDefinition,
    private readonly successState: ActionableState,
    private readonly maximumTries: number,
    private readonly tries: number = 0
  ) {
    super(entityId, 'SkillState', [stateAction]);
  }

  protected override stateResult(
    _1: ActionableDefinition,
    result: ResultLiteral
  ): ActionableState {
    switch (result) {
      case 'SUCCESS':
        return this.successState;
      case 'FAILURE':
        return this.tries + 1 >= this.maximumTries
          ? emptyState
          : this.clone(this.tries + 1);
      default:
        return this;
    }
  }

  private clone(tries: number): SkillState {
    return new SkillState(
      this.entityId,
      this.stateActions[0],
      this.successState,
      this.maximumTries,
      tries
    );
  }
}

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';
import { emptyState } from './empty.state';

export class TryState extends ActionableState {
  private tries: number;

  constructor(
    entityId: string,
    stateAction: ActionableDefinition,
    protected readonly maximumTries: number
  ) {
    super(entityId, 'TryState', [stateAction]);

    this.tries = 0;
  }

  protected override stateResult(
    _1: ActionableDefinition,
    result: ResultLiteral
  ): ActionableState {
    this.tries += 1;

    switch (result) {
      case 'SUCCESS':
        return emptyState;
      case 'FAILURE':
        return this.tries >= this.maximumTries ? emptyState : this;
      default:
        return this;
    }
  }
}

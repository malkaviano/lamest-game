import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';

export class SimpleState extends ActionableState {
  constructor(entityId: string, stateActions: ActionableDefinition[]) {
    super(entityId, 'SimpleState', stateActions);
  }

  protected override stateResult(
    _1: ActionableDefinition,
    _2: ResultLiteral
  ): ActionableState {
    return this;
  }
}

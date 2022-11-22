import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';

export class SimpleState extends ActionableState {
  constructor(stateActions: ActionableDefinition[]) {
    super('SimpleState', stateActions);
  }

  protected override stateResult(
    _1: ActionableDefinition,
    _2: ResultLiteral
  ): ActionableState {
    return this;
  }
}

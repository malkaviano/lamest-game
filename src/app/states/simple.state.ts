import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class SimpleState extends ActionableState {
  constructor(stateActions: ArrayView<ActionableDefinition>) {
    super('SimpleState', stateActions);
  }

  protected override stateResult(
    _1: ActionableDefinition,
    _2: ResultLiteral
  ): { state: ActionableState; log?: string } {
    return { state: this };
  }
}

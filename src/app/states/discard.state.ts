import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';

export class DiscardState extends ActionableState {
  constructor(stateActions: ActionableDefinition[]) {
    super('Discard', stateActions);
  }

  protected stateResult(
    action: ActionableDefinition,
    _: ResultLiteral
  ): ActionableState {
    const actions = this.actions.items;

    const index = actions.indexOf(action);

    return new DiscardState(actions.filter((_, i) => i !== index));
  }
}

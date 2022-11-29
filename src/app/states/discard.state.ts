import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class DiscardState extends ActionableState {
  constructor(stateActions: ArrayView<ActionableDefinition>) {
    super('DiscardState', stateActions);
  }

  protected override stateResult(
    action: ActionableDefinition,
    _: ResultLiteral
  ): { state: ActionableState; log?: string } {
    const actions = this.actions.items;

    const index = actions.indexOf(action);

    const discarded = actions[index];

    return {
      state: new DiscardState(
        new ArrayView(actions.filter((_, i) => i !== index))
      ),
      log: discarded.label,
    };
  }
}

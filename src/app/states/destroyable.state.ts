import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';

export class DestroyableState extends ActionableState {
  constructor(
    stateActions: ActionableDefinition[],
    protected readonly destroyedState: ActionableState,
    public readonly hitPoints: number
  ) {
    super('DestroyableState', stateActions);
  }

  protected override stateResult(
    _1: ActionableDefinition,
    _2: ResultLiteral,
    damageTaken?: number
  ): ActionableState {
    const hp = this.hitPoints - (damageTaken ?? 0);

    if (hp > 0) {
      return new DestroyableState(this.stateActions, this.destroyedState, hp);
    }

    return this.destroyedState;
  }
}

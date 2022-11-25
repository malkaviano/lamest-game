import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { errorMessages } from '../definitions/error-messages.definition';
import { StateLiteral } from '../literals/state.literal';
import { ResultLiteral } from '../literals/result.literal';
import { DamageDefinition } from '../definitions/damage.definition';

export abstract class ActionableState {
  constructor(
    public readonly name: StateLiteral,
    protected stateActions: ActionableDefinition[]
  ) {}

  public get actions(): ArrayView<ActionableDefinition> {
    return new ArrayView(this.stateActions);
  }

  public get attack(): { skillValue: number; damage: DamageDefinition } | null {
    return null;
  }

  public onResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    damageTaken?: number
  ): ActionableState {
    if (!this.stateActions.some((a) => a.equals(action))) {
      throw new Error(errorMessages['WRONG-ACTION']);
    }

    return this.stateResult(action, result, damageTaken);
  }

  protected abstract stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    damageTaken?: number
  ): ActionableState;
}

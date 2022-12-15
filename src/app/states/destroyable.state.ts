import { ActionableDefinition } from '../definitions/actionable.definition';
import {
  createDamagedMessage,
  createDestroyedByDamageMessage,
} from '../definitions/log-message.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class DestroyableState extends ActionableState {
  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    protected readonly destroyedState: LazyHelper<ActionableState>,
    public readonly hitPoints: number
  ) {
    super('DestroyableState', stateActions);
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): { state: ActionableState; log?: string } {
    if (
      action.actionable === 'ATTACK' &&
      result === 'SUCCESS' &&
      values.effect
    ) {
      const dmg = values.effect.amount;

      const hp = this.hitPoints - dmg;

      if (hp > 0) {
        return {
          state: new DestroyableState(
            this.stateActions,
            this.destroyedState,
            hp
          ),
          log: createDamagedMessage(dmg, values.effect.effectType),
        };
      }

      return {
        state: this.destroyedState.value,
        log: createDestroyedByDamageMessage(dmg, values.effect.effectType),
      };
    }

    return { state: this };
  }
}

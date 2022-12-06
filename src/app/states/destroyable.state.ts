import { ActionableDefinition } from '../definitions/actionable.definition';
import {
  createDamagedMessage,
  createDestroyedByDamageMessage,
} from '../definitions/log-message.definition';
import { LazyHelper } from '../helpers/lazy.helper';
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
    damageTaken?: number
  ): { state: ActionableState; log?: string } {
    if (action.actionable === 'ATTACK' && result === 'SUCCESS' && damageTaken) {
      const dmg = damageTaken;

      const hp = this.hitPoints - dmg;

      if (hp > 0) {
        return {
          state: new DestroyableState(
            this.stateActions,
            this.destroyedState,
            hp
          ),
          log: createDamagedMessage(dmg),
        };
      }

      return {
        state: this.destroyedState.value,
        log: createDestroyedByDamageMessage(dmg),
      };
    }

    return { state: this };
  }
}

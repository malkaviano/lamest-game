import { ActionableDefinition } from '../definitions/actionable.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { GameMessagesStoreService } from '../stores/game-messages.store';

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
      action.actionable === 'AFFECT' &&
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
          log: GameMessagesStoreService.createEffectDamagedMessage(
            values.effect.effectType,
            dmg.toString()
          ),
        };
      }

      return {
        state: this.destroyedState.value,
        log: GameMessagesStoreService.createDestroyedByDamageMessage(
          values.effect.effectType,
          dmg.toString()
        ),
      };
    }

    return { state: this };
  }
}

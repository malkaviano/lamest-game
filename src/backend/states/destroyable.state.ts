import { ActionableDefinition } from '@definitions/actionable.definition';
import { ReactionValuesInterface } from '@interfaces/reaction-values.interface';
import { GameStringsStore } from '@stores/game-strings.store';
import { ArrayView } from '@wrappers/array.view';
import { ActionableState } from '@states/actionable.state';
import { LazyHelper } from '@helpers/lazy.helper';
import { CheckResultLiteral } from '@literals/check-result.literal';

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
    result: CheckResultLiteral,
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
          log: GameStringsStore.createEffectDamagedMessage(
            values.effect.effectType,
            dmg.toString()
          ),
        };
      }

      return {
        state: this.destroyedState.value,
        log: GameStringsStore.createDestroyedByDamageMessage(
          values.effect.effectType,
          dmg.toString()
        ),
      };
    }

    return { state: this };
  }
}

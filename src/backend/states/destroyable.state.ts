import { ActionableDefinition } from '@definitions/actionable.definition';
import { ReactionValues } from '@values/reaction.value';
import { GameStringsStore } from '@stores/game-strings.store';
import { ArrayView } from '@wrappers/array.view';
import { ActionableState } from '@states/actionable.state';
import { LazyHelper } from '@helpers/lazy.helper';
import { CheckResultLiteral } from '@literals/check-result.literal';

export class DestroyableState extends ActionableState {
  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    protected readonly lootState: LazyHelper<ActionableState>,
    public readonly hitPoints: number
  ) {
    super('DestroyableState', stateActions);
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: CheckResultLiteral,
    values: ReactionValues
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
          state: new DestroyableState(this.stateActions, this.lootState, hp),
          log: GameStringsStore.createEffectDamagedMessage(
            values.effect.effectType,
            dmg.toString()
          ),
        };
      }

      return {
        state: this.lootState.value,
        log: GameStringsStore.createDestroyedByDamageMessage(
          values.effect.effectType,
          dmg.toString()
        ),
      };
    }

    return { state: this };
  }
}

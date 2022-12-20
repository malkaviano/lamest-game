import { ActionableDefinition } from '../definitions/actionable.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { ResultLiteral } from '../literals/result.literal';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class DestroyableState extends ActionableState {
  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    protected readonly destroyedState: LazyHelper<ActionableState>,
    public readonly hitPoints: number,
    protected readonly stringMessagesStoreService: StringMessagesStoreService
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
            hp,
            this.stringMessagesStoreService
          ),
          log: this.stringMessagesStoreService.createEffectDamagedMessage(
            values.effect.effectType,
            dmg.toString()
          ),
        };
      }

      return {
        state: this.destroyedState.value,
        log: this.stringMessagesStoreService.createDestroyedByDamageMessage(
          values.effect.effectType,
          dmg.toString()
        ),
      };
    }

    return { state: this };
  }
}

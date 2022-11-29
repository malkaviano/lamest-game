import { ActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { ActionableEvent } from '../events/actionable.event';
import { LazyHelper } from '../helpers/lazy.helper';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { DestroyableState } from './destroyable.state';

export class EnemyState extends ActionableState {
  private destroyableState: DestroyableState;

  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    private readonly killedState: LazyHelper<ActionableState>,
    hitPoints: number,
    private readonly damage: DamageDefinition,
    private readonly attackSkillValue: number,
    private readonly onlyReact: boolean
  ) {
    super('EnemyState', stateActions);

    this.destroyableState = new DestroyableState(
      stateActions,
      killedState,
      hitPoints
    );
  }

  public get hitPoints(): number {
    return this.destroyableState.hitPoints;
  }

  public override attack(action: ActionableDefinition): {
    skillValue: number;
    damage: DamageDefinition;
  } | null {
    if (this.onlyReact && action.actionable !== 'ATTACK') {
      return null;
    }

    return {
      skillValue: this.attackSkillValue,
      damage: this.damage,
    };
  }

  public override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    damageTaken?: number | undefined
  ): { state: ActionableState; log?: string } {
    const { state, log } = this.destroyableState.onResult(
      action,
      result,
      damageTaken
    );

    this.destroyableState = state as DestroyableState;

    if (this.hitPoints > 0) {
      return {
        state: new EnemyState(
          this.actions,
          this.killedState,
          this.hitPoints,
          this.damage,
          this.attackSkillValue,
          this.onlyReact
        ),
        log,
      };
    }

    return { state: this.destroyableState, log };
  }
}

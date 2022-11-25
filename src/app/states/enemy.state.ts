import { ActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';
import { DestroyableState } from './destroyable.state';

export class EnemyState extends ActionableState {
  private destroyableState: DestroyableState;

  constructor(
    stateActions: ActionableDefinition[],
    protected readonly killedState: ActionableState,
    hitPoints: number,
    protected readonly damage: DamageDefinition,
    protected readonly attackSkillValue: number
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

  public override get attack(): {
    skillValue: number;
    damage: DamageDefinition;
  } | null {
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
          this.actions.items,
          this.killedState,
          this.hitPoints,
          this.damage,
          this.attackSkillValue
        ),
        log,
      };
    }

    return { state: this.destroyableState, log };
  }
}

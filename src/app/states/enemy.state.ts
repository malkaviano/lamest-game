import { ActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';
import { DestroyableState } from './destroyable.state';

export class EnemyState extends ActionableState {
  private destroyableState: DestroyableState;

  constructor(
    stateActions: ActionableDefinition[],
    protected readonly killedState: ActionableState,
    hitPoints: number,
    protected readonly damageDefinition: DamageDefinition
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

  public override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    damageTaken?: number | undefined
  ): ActionableState {
    this.destroyableState = this.destroyableState.onResult(
      action,
      result,
      damageTaken
    ) as DestroyableState;

    return this.hitPoints > 0
      ? new EnemyState(
          this.actions.items,
          this.killedState,
          this.hitPoints,
          this.damageDefinition
        )
      : this.destroyableState;
  }

  public override damage(_: ActionableEvent): DamageDefinition | null {
    return this.damageDefinition;
  }
}

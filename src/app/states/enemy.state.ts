import { ActionableDefinition } from '../definitions/actionable.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { EnemyAttack } from '../interfaces/enemy-attack.interface';
import { EnemyBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';
import { DestroyableState } from './destroyable.state';

export class EnemyState extends ActionableState {
  private destroyableState: DestroyableState;

  private wasAttacked: boolean;

  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    killedState: LazyHelper<ActionableState>,
    hitPoints: number,
    private readonly weapon: WeaponDefinition,
    private readonly attackSkillValue: number,
    private readonly behavior: EnemyBehaviorLiteral
  ) {
    super('EnemyState', stateActions);

    this.destroyableState = new DestroyableState(
      stateActions,
      killedState,
      hitPoints
    );

    this.wasAttacked = false;
  }

  public get hitPoints(): number {
    return this.destroyableState.hitPoints;
  }

  public override get attack(): EnemyAttack | null {
    if (this.behavior === 'RETALIATE' && !this.wasAttacked) {
      return null;
    }

    this.wasAttacked = false;

    return {
      skillValue: this.attackSkillValue,
      damage: this.weapon.damage,
      dodgeable: this.weapon.dodgeable,
      weaponName: this.weapon.label,
    };
  }

  protected override stateResult(
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

    this.wasAttacked = true;

    if (this.hitPoints > 0) {
      return {
        state: this,
        log,
      };
    }

    return { state: this.destroyableState, log };
  }
}

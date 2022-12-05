import { ActorBehavior } from '../behaviors/actor.behavior';
import { ActionableDefinition } from '../definitions/actionable.definition';
import {
  createDamagedMessage,
  createKilledByDamageMessage,
} from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { EnemyAttack } from '../interfaces/enemy-attack.interface';
import { EnemyBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { ActionableState } from './actionable.state';

export class EnemyState extends ActionableState {
  private wasAttacked: boolean;

  constructor(
    stateActions: ArrayView<ActionableDefinition>,
    private readonly killedState: LazyHelper<ActionableState>,
    private readonly weapon: WeaponDefinition,
    private readonly enemyBehavior: EnemyBehaviorLiteral,
    private readonly actorBehavior: ActorBehavior
  ) {
    super('EnemyState', stateActions);

    this.wasAttacked = false;
  }

  public get hitPoints(): number {
    return this.actorBehavior.derivedAttributes.HP.value;
  }

  public override get attack(): EnemyAttack | null {
    if (this.enemyBehavior === 'RETALIATE' && !this.wasAttacked) {
      return null;
    }

    this.wasAttacked = false;

    return {
      skillValue: this.actorBehavior.skills[this.weapon.skillName],
      weapon: this.weapon,
    };
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral,
    damageTaken?: number | undefined
  ): { state: ActionableState; log?: string } {
    let log: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let state: ActionableState = this;

    if (action.actionable === 'ATTACK') {
      this.wasAttacked = true;

      if (result === 'SUCCESS' && damageTaken) {
        const { current, effective } = this.actorBehavior.damaged(damageTaken);

        if (current === 0) {
          log = createKilledByDamageMessage(effective);
          state = this.killedState.value;
        } else {
          log = createDamagedMessage(effective);
        }
      }
    }

    return { state, log };
  }
}

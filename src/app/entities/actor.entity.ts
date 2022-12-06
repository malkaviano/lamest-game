import { EnemyAttack } from '../interfaces/enemy-attack.interface';
import { InteractiveEntity } from './interactive.entity';

export class ActorEntity extends InteractiveEntity {
  public get attack(): EnemyAttack | null {
    return this.currentState.attack;
  }
}

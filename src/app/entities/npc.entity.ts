import { ActorBehavior } from '../behaviors/actor.behavior';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { EnemyAttack } from '../interfaces/enemy-attack.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';

export class NpcEntity extends InteractiveEntity implements ActorInterface {
  constructor(
    id: string,
    name: string,
    description: string,
    currentState: ActionableState,
    resettable: boolean,
    private readonly actorBehavior: ActorBehavior
  ) {
    super(id, name, description, currentState, resettable);
  }

  public get characteristics(): CharacteristicSetDefinition {
    return this.actorBehavior.characteristics;
  }

  public get derivedAttributes(): DerivedAttributeSetDefinition {
    return this.actorBehavior.derivedAttributes;
  }

  public get skills(): KeyValueInterface<number> {
    return this.actorBehavior.skills;
  }

  public damaged(damage: number): HitPointsEvent {
    return this.actorBehavior.damaged(damage);
  }

  public healed(heal: number): HitPointsEvent {
    return this.actorBehavior.healed(heal);
  }

  public get attack(): EnemyAttack | null {
    return this.currentState.attack;
  }
}

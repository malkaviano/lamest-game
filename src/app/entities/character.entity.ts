import { Observable, Subject } from 'rxjs';

import { IdentityDefinition } from '../definitions/identity.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { HitPointsEvent } from '../events/hitpoints.event';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActorBehavior } from '../behaviors/actor.behavior';

export class CharacterEntity implements ActorInterface {
  private readonly hpChanged: Subject<HitPointsEvent>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  constructor(
    public readonly identity: IdentityDefinition,
    private readonly actorBehavior: ActorBehavior
  ) {
    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();
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
    const result = this.actorBehavior.damaged(damage);

    if (result.effective) {
      this.hpChanged.next(result);
    }

    return result;
  }

  public healed(heal: number): HitPointsEvent {
    const result = this.actorBehavior.healed(heal);

    if (result.effective) {
      this.hpChanged.next(result);
    }

    return result;
  }
}

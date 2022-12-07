import { Observable, Subject } from 'rxjs';

import { IdentityDefinition } from '../definitions/identity.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActorBehavior } from '../behaviors/actor.behavior';
import {
  createDamagedMessage,
  createHealedMessage,
} from '../definitions/log-message.definition';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ClassificationLiteral } from '../literals/classification.literal';
import { emptyState } from '../states/empty.state';
import { ActorEntity } from './actor.entity';

export class PlayerEntity extends ActorEntity {
  private readonly hpChanged: Subject<HitPointsEvent>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  constructor(
    public readonly identity: IdentityDefinition,
    actorBehavior: ActorBehavior,
    equipmentBehavior: EquipmentBehavior
  ) {
    super(
      identity.name,
      identity.name,
      '',
      emptyState,
      false,
      actorBehavior,
      equipmentBehavior
    );

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();

    this.weaponEquippedChanged = new Subject();

    this.weaponEquippedChanged$ = this.weaponEquippedChanged.asObservable();
  }

  public override get classification(): ClassificationLiteral {
    return 'PLAYER';
  }

  public override reactTo(
    action: ActionableDefinition,
    result: ResultLiteral,
    value?: number | undefined
  ): string | undefined {
    const { actionable } = action;

    let resultLog: string | undefined;

    if (actionable === 'ATTACK' && result === 'SUCCESS' && value) {
      const { effective } = this.damaged(value);

      resultLog = createDamagedMessage(effective);
    } else if (
      actionable === 'HEAL' &&
      ['SUCCESS', 'NONE'].includes(result) &&
      value
    ) {
      const { effective } = this.healed(value);

      resultLog = createHealedMessage(effective);
    }

    return resultLog;
  }

  private damaged(damage: number): HitPointsEvent {
    const result = this.actorBehavior.damaged(damage);

    if (result.effective) {
      this.hpChanged.next(result);
    }

    return result;
  }

  private healed(heal: number): HitPointsEvent {
    const result = this.actorBehavior.healed(heal);

    if (result.effective) {
      this.hpChanged.next(result);
    }

    return result;
  }
}

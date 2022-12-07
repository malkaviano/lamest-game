import { Observable, Subject } from 'rxjs';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import {
  createDamagedMessage,
  createHealedMessage,
} from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActorSituation } from '../literals/actor-situation.literal';
import { ClassificationLiteral } from '../literals/classification.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private readonly hpChanged: Subject<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  constructor(
    id: string,
    name: string,
    description: string,
    currentState: ActionableState,
    resettable: boolean,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior,
    protected readonly killedState: ActionableState
  ) {
    super(id, name, description, currentState, resettable);

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();

    this.weaponEquippedChanged = new Subject();

    this.weaponEquippedChanged$ = this.weaponEquippedChanged.asObservable();
  }

  public get situation(): ActorSituation {
    return this.actorBehavior.situation;
  }

  public override get classification(): ClassificationLiteral {
    return 'ACTOR';
  }

  public get action(): ActionableDefinition | null {
    return createActionableDefinition('ATTACK', 'attack', 'Attack');
  }

  public get weaponEquipped(): WeaponDefinition {
    return this.equipmentBehavior.weaponEquipped;
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

  public equip(weapon: WeaponDefinition): WeaponDefinition | null {
    const previous = this.equipmentBehavior.equip(weapon);

    this.weaponEquippedChanged.next(weapon);

    return previous;
  }

  public unEquip(): WeaponDefinition | null {
    const weapon = this.equipmentBehavior.unEquip();

    if (weapon) {
      this.weaponEquippedChanged.next(weapon);
    }

    return weapon;
  }

  public override reactTo(
    action: ActionableDefinition,
    result: ResultLiteral,
    value?: number | undefined
  ): string | undefined {
    const { actionable } = action;

    let resultLog: string | undefined;

    if (this.situation === 'ALIVE') {
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
    }

    if (this.situation === 'DEAD') {
      this.publish(this.currentState.actions, this.killedState.actions);
    }

    return resultLog;
  }

  protected damaged(damage: number): HitPointsEvent {
    const result = this.actorBehavior.damaged(damage);

    if (result.effective) {
      this.hpChanged.next(result);
    }

    return result;
  }

  protected healed(heal: number): HitPointsEvent {
    const result = this.actorBehavior.healed(heal);

    if (result.effective) {
      this.hpChanged.next(result);
    }

    return result;
  }
}

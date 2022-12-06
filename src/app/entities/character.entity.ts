import { Observable, Subject } from 'rxjs';

import { IdentityDefinition } from '../definitions/identity.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { HitPointsEvent } from '../events/hitpoints.event';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActorBehavior } from '../behaviors/actor.behavior';
import {
  createDamagedMessage,
  createHealedMessage,
} from '../definitions/log-message.definition';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';

export class CharacterEntity implements ActorInterface {
  private readonly hpChanged: Subject<HitPointsEvent>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  constructor(
    public readonly identity: IdentityDefinition,
    private readonly actorBehavior: ActorBehavior,
    private readonly equipmentBehavior: EquipmentBehavior
  ) {
    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();

    this.weaponEquippedChanged = new Subject();

    this.weaponEquippedChanged$ = this.weaponEquippedChanged.asObservable();
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

  public reactTo(
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

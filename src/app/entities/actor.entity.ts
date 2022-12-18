import { Observable, Subject } from 'rxjs';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import {
  createEffectDamagedMessage,
  createEffectRestoredHPMessage,
  createHPDidNotChangeMessage,
} from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { SceneActorsInfoInterface } from '../interfaces/scene-actors.interface';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ClassificationLiteral } from '../literals/classification.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from '../states/actionable.state';
import { ArrayView } from '../views/array.view';
import { InteractiveEntity } from './interactive.entity';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private readonly hpChanged: Subject<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  constructor(
    identity: ActorIdentityDefinition,
    currentState: ActionableState,
    resettable: boolean,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior,
    protected readonly killedState: ActionableState
  ) {
    super(
      identity.id,
      identity.name,
      identity.description,
      currentState,
      resettable
    );

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();

    this.weaponEquippedChanged = new Subject();

    this.weaponEquippedChanged$ = this.weaponEquippedChanged.asObservable();
  }

  public get dodgesPerRound(): number {
    return this.actorBehavior.dodgesPerRound;
  }

  public get situation(): ActorSituationLiteral {
    return this.actorBehavior.situation;
  }

  public override get classification(): ClassificationLiteral {
    return 'ACTOR';
  }

  // TODO: implement some AI behavior
  public action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>
  ): ActionableEvent | null {
    const player = sceneActorsInfo.items.find(
      (a) => a.classification === 'PLAYER' && a.situation === 'ALIVE'
    );

    if (player) {
      return new ActionableEvent(
        createActionableDefinition('AFFECT', 'affect', 'Use Equipped'),
        player.id
      );
    }

    return null;
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
    values: ReactionValuesInterface
  ): string | undefined {
    const { actionable } = action;

    let resultLog: string | undefined;

    if (this.situation === 'ALIVE') {
      if (
        values.effect &&
        ((actionable === 'AFFECT' && result === 'SUCCESS') ||
          (actionable === 'CONSUME' && ['SUCCESS', 'NONE'].includes(result)))
      ) {
        const result = this.actorBehavior.effectReceived(values.effect);

        if (result.effective) {
          this.hpChanged.next(result);
        }

        if (result.current > result.previous) {
          resultLog = createEffectRestoredHPMessage(
            values.effect.effectType,
            result.effective
          );
        } else if (result.current < result.previous) {
          resultLog = createEffectDamagedMessage(
            result.effective,
            values.effect.effectType
          );
        } else {
          resultLog = createHPDidNotChangeMessage();
        }
      }
    }

    if (this.situation === 'DEAD') {
      this.publish(this.currentState.actions, this.killedState.actions);
    }

    return resultLog;
  }
}

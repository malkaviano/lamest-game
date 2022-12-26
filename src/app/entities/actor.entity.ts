import { Observable, Subject } from 'rxjs';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { CooldownBehavior } from '../behaviors/cooldown.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableEvent } from '../events/actionable.event';
import { EffectEvent } from '../events/effect.event';
import { EnergyPointsEvent } from '../events/energy-points.event';
import { HitPointsEvent } from '../events/hit-points.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ReactionValuesInterface } from '../interfaces/reaction-values.interface';
import { SceneActorsInfoInterface } from '../interfaces/scene-actors.interface';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ClassificationLiteral } from '../literals/classification.literal';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { ResultLiteral } from '../literals/result.literal';
import { VisibilityLiteral } from '../literals/visibility.literal';
import { ActionableState } from '../states/actionable.state';
import { GameMessagesStore } from '../stores/game-messages.store';

import { ArrayView } from '../views/array.view';
import { InteractiveEntity } from './interactive.entity';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private mVisibility: VisibilityLiteral;

  private readonly hpChanged: Subject<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  private readonly epChanged: Subject<EnergyPointsEvent>;

  private readonly visibilityChanged: Subject<VisibilityLiteral>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  public readonly epChanged$: Observable<EnergyPointsEvent>;

  public readonly visibilityChanged$: Observable<VisibilityLiteral>;

  constructor(
    identity: ActorIdentityDefinition,
    currentState: ActionableState,
    resettable: boolean,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior,
    protected readonly killedState: ActionableState,
    protected readonly cooldownBehavior: CooldownBehavior
  ) {
    super(
      identity.id,
      identity.name,
      identity.description,
      currentState,
      resettable
    );

    this.mVisibility = 'VISIBLE';

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();

    this.weaponEquippedChanged = new Subject();

    this.weaponEquippedChanged$ = this.weaponEquippedChanged.asObservable();

    this.epChanged = new Subject();

    this.epChanged$ = this.epChanged.asObservable();

    this.visibilityChanged = new Subject();

    this.visibilityChanged$ = this.visibilityChanged.asObservable();
  }

  public get visibility(): VisibilityLiteral {
    return this.mVisibility;
  }

  public changeVisibility(visibility: VisibilityLiteral): void {
    const old = this.visibility;

    this.mVisibility = visibility;

    if (old !== this.visibility) {
      this.visibilityChanged.next(this.visibility);
    }
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

  public wannaDodge(effect: EffectTypeLiteral): boolean {
    return this.actorBehavior.wannaDodge(effect);
  }

  // TODO: implement some AI behavior
  public action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>
  ): ActionableEvent | null {
    if (this.cooldownBehavior.canAct) {
      const player = sceneActorsInfo.items.find(
        (a) =>
          a.classification === 'PLAYER' &&
          a.situation === 'ALIVE' &&
          a.visibility === 'VISIBLE'
      );

      if (player) {
        return new ActionableEvent(
          createActionableDefinition('AFFECT', 'affect', 'Use Equipped'),
          player.id
        );
      }
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
  ): string | null {
    const { actionable } = action;

    let resultHPLog: string | null = null;
    let resultEPLog: string | null = null;

    if (this.situation === 'ALIVE') {
      if (
        values.effect &&
        ((actionable === 'AFFECT' && result === 'SUCCESS') ||
          (actionable === 'CONSUME' && ['SUCCESS', 'NONE'].includes(result)))
      ) {
        resultHPLog = this.effect(values.effect);
      }

      if (
        values.energy &&
        actionable === 'CONSUME' &&
        ['SUCCESS', 'NONE'].includes(result)
      ) {
        resultEPLog = this.energy(values.energy);
      }
    }

    if (this.situation === 'DEAD') {
      this.publish(this.currentState.actions, this.killedState.actions);
    }

    const logs = [resultHPLog, resultEPLog].filter((log) => log);

    if (logs.length) {
      return logs.join(' and ');
    }

    return null;
  }

  private effect(effect: EffectEvent): string | null {
    const result = this.actorBehavior.effectReceived(effect);

    let resultLog: string | null;

    if (result.effective) {
      this.hpChanged.next(result);
    }

    if (result.current > result.previous) {
      resultLog = GameMessagesStore.createEffectRestoredHPMessage(
        effect.effectType,
        result.effective.toString()
      );
    } else if (result.current < result.previous) {
      resultLog = GameMessagesStore.createEffectDamagedMessage(
        effect.effectType,
        result.effective.toString()
      );
    } else {
      resultLog = GameMessagesStore.createHPDidNotChangeMessage();
    }

    return resultLog;
  }

  private energy(energy: number): string | null {
    const result = this.actorBehavior.energyChange(energy);

    let resultLog: string | null;

    if (result.effective) {
      this.epChanged.next(result);
    }

    if (result.current > result.previous) {
      resultLog = GameMessagesStore.createEnergizedMessage(
        result.effective.toString()
      );
    } else if (result.current < result.previous) {
      resultLog = GameMessagesStore.createEnergyDrainedMessage(
        result.effective.toString()
      );
    } else {
      resultLog = GameMessagesStore.createEnergyDidNotChangeMessage();
    }

    return resultLog;
  }
}

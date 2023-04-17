import { Observable, Subject } from 'rxjs';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { AiBehavior } from '../behaviors/ai.behavior';
import { CooldownBehavior } from '../behaviors/cooldown.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ActionableDefinition } from '../../core/definitions/actionable.definition';
import { ActorIdentityDefinition } from '../../core/definitions/actor-identity.definition';
import { CharacteristicSetDefinition } from '../../core/definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../../core/definitions/derived-attribute-set.definition';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';
import { ReactionValuesInterface } from '../../core/interfaces/reaction-values.interface';
import { SceneActorsInfoInterface } from '../../core/interfaces/scene-actors.interface';
import { ActorSituationLiteral } from '../../core/literals/actor-situation.literal';
import { ClassificationLiteral } from '../../core/literals/classification.literal';
import { EffectTypeLiteral } from '../../core/literals/effect-type.literal';
import { ResultLiteral } from '../../core/literals/result.literal';
import { VisibilityLiteral } from '../../core/literals/visibility.literal';
import { ActionableState } from '../states/actionable.state';
import { GameStringsStore } from '../stores/game-strings.store';
import { ArrayView } from '../../core/view-models/array.view';
import { InteractiveEntity } from './interactive.entity';
import { HitPointsEvent } from '../../core/events/hit-points.event';
import { EnergyPointsEvent } from '../../core/events/energy-points.event';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private mVisibility: VisibilityLiteral;

  private readonly mAfflictedBy: Set<string>;

  private readonly hpChanged: Subject<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  private readonly epChanged: Subject<EnergyPointsEvent>;

  private readonly visibilityChanged: Subject<VisibilityLiteral>;

  protected readonly cooldownBehavior: CooldownBehavior;

  protected readonly aiBehavior: AiBehavior;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  public readonly epChanged$: Observable<EnergyPointsEvent>;

  public readonly visibilityChanged$: Observable<VisibilityLiteral>;

  public readonly canActChanged$: Observable<boolean>;

  constructor(
    identity: ActorIdentityDefinition,
    currentState: ActionableState,
    resettable: boolean,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior,
    protected readonly killedState: ActionableState,
    behaviors: {
      readonly cooldownBehavior: CooldownBehavior;
      readonly aiBehavior: AiBehavior;
    }
  ) {
    super(
      identity.id,
      identity.name,
      identity.description,
      currentState,
      resettable
    );

    this.cooldownBehavior = behaviors.cooldownBehavior;

    this.aiBehavior = behaviors.aiBehavior;

    this.mVisibility = identity.visibility;

    this.mAfflictedBy = new Set();

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();

    this.weaponEquippedChanged = new Subject();

    this.weaponEquippedChanged$ = this.weaponEquippedChanged.asObservable();

    this.epChanged = new Subject();

    this.epChanged$ = this.epChanged.asObservable();

    this.visibilityChanged = new Subject();

    this.visibilityChanged$ = this.visibilityChanged.asObservable();

    this.canActChanged$ = this.cooldownBehavior.canActChanged$;
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

  public get visibility(): VisibilityLiteral {
    return this.mVisibility;
  }

  public changeVisibility(visibility: VisibilityLiteral): void {
    if (visibility !== this.visibility) {
      this.mVisibility = visibility;

      this.visibilityChanged.next(this.visibility);
    }
  }

  public wannaDodge(effect: EffectTypeLiteral): boolean {
    return this.actorBehavior.wannaDodge(effect);
  }

  public action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>
  ): ActionableEvent | null {
    if (this.cooldownBehavior.canAct) {
      this.cooldownBehavior.acted();

      return this.aiBehavior.action(sceneActorsInfo, [
        ...this.mAfflictedBy.values(),
      ]);
    }

    return null;
  }

  public afflictedBy(actorId: string): void {
    this.mAfflictedBy.add(actorId);
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

    if (
      this.situation === 'ALIVE' &&
      ['AFFECT', 'CONSUME'].includes(actionable)
    ) {
      if (values.effect) {
        resultHPLog = this.effect(values.effect);
      }

      if (values.energy) {
        resultEPLog = this.energy(values.energy);
      }

      const logs = [resultHPLog, resultEPLog].filter((log) => log);

      if (logs.length) {
        return logs.join(' and ');
      }
    } else {
      return super.reactTo(action, result, values);
    }

    return null;
  }

  private effect(effect: EffectEvent): string | null {
    const result = this.actorBehavior.effectReceived(effect);

    let resultLog: string | null;

    if (result.effective) {
      this.hpChanged.next(result);

      if (this.situation === 'DEAD') {
        this.publish(this.currentState.actions, this.killedState.actions);

        this.currentState = this.killedState;
      }
    }

    if (result.current > result.previous) {
      resultLog = GameStringsStore.createEffectRestoredHPMessage(
        effect.effectType,
        result.effective.toString()
      );
    } else if (result.current < result.previous) {
      resultLog = GameStringsStore.createEffectDamagedMessage(
        effect.effectType,
        result.effective.toString()
      );
    } else {
      resultLog = GameStringsStore.createHPDidNotChangeMessage();
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
      resultLog = GameStringsStore.createEnergizedMessage(
        result.effective.toString()
      );
    } else if (result.current < result.previous) {
      resultLog = GameStringsStore.createEnergyDrainedMessage(
        result.effective.toString()
      );
    } else {
      resultLog = GameStringsStore.createEnergyDidNotChangeMessage();
    }

    return resultLog;
  }
}

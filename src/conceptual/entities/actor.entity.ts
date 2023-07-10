import { Observable, Subject } from 'rxjs';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { AiBehavior } from '../behaviors/ai.behavior';
import { RegeneratorBehavior } from '../behaviors/regenerator.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '@definitions/derived-attribute-set.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ReactionValuesInterface } from '@interfaces/reaction-values.interface';
import { SceneActorsInfoInterface } from '@interfaces/scene-actors.interface';
import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { ClassificationLiteral } from '@literals/classification.literal';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { ActionableState } from '../states/actionable.state';
import { ArrayView } from '../view-models/array.view';
import { InteractiveEntity } from './interactive.entity';
import { HitPointsEvent } from '../events/hit-points.event';
import { EnergyPointsEvent } from '../events/energy-points.event';
import { ActionableEvent } from '../events/actionable.event';
import { EffectEvent } from '../events/effect.event';
import { GameStringsStore } from '../../stores/game-strings.store';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { ActionPointsEvent } from '../events/action-points.event';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private mVisibility: VisibilityLiteral;

  private readonly mAfflictedBy: Set<string>;

  private readonly hpChanged: Subject<HitPointsEvent>;

  private readonly weaponEquippedChanged: Subject<WeaponDefinition>;

  private readonly epChanged: Subject<EnergyPointsEvent>;

  private readonly visibilityChanged: Subject<VisibilityLiteral>;

  private readonly apChanged: Subject<ActionPointsEvent>;

  protected readonly regeneratorBehavior: RegeneratorBehavior;

  protected readonly aiBehavior: AiBehavior;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  public readonly weaponEquippedChanged$: Observable<WeaponDefinition>;

  public readonly epChanged$: Observable<EnergyPointsEvent>;

  public readonly visibilityChanged$: Observable<VisibilityLiteral>;

  public readonly apChanged$: Observable<ActionPointsEvent>;

  constructor(
    identity: ActorIdentityDefinition,
    currentState: ActionableState,
    resettable: boolean,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior,
    protected readonly killedState: ActionableState,
    behaviors: {
      readonly regeneratorBehavior: RegeneratorBehavior;
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

    this.regeneratorBehavior = behaviors.regeneratorBehavior;

    this.regeneratorBehavior.apRegenerated$.subscribe((ap) =>
      this.apRecovered(ap)
    );

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

    this.apChanged = new Subject();

    this.apChanged$ = this.apChanged.asObservable();
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

  public override get behavior(): BehaviorLiteral {
    return this.aiBehavior.aiBehavior;
  }

  public override get ignores(): ArrayView<VisibilityLiteral> {
    return this.aiBehavior.ignores;
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
    this.regeneratorBehavior.startApRegeneration();

    return this.aiBehavior.action(sceneActorsInfo, [
      ...this.mAfflictedBy.values(),
    ]);
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
    result: CheckResultLiteral,
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

  public apSpent(apSpent: number): void {
    this.apChange(-apSpent);
  }

  public apRecovered(apRecovered: number): void {
    this.apChange(apRecovered);

    if (
      this.derivedAttributes['CURRENT AP'].value ===
      this.derivedAttributes['MAX AP'].value
    ) {
      this.regeneratorBehavior.stopApRegeneration();
    }
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

  private apChange(ap: number) {
    const result = this.actorBehavior.actionPointsChange(ap);

    if (result.effective) {
      this.apChanged.next(result);
    }
  }
}

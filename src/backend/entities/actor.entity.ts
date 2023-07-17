import { Observable, Subject } from 'rxjs';

import { ActorBehavior } from '@behaviors/actor.behavior';
import { AiBehavior } from '@behaviors/ai.behavior';
import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';
import {
  EquipmentBehavior,
  clothArmor,
  unarmedWeapon,
} from '@behaviors/equipment.behavior';
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
import { ActionableState } from '@states/actionable.state';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';
import { ActionableEvent } from '@events/actionable.event';
import { EffectEvent } from '@events/effect.event';
import { GameStringsStore } from '@stores/game-strings.store';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';
import { DerivedAttributeEvent } from '@events/derived-attribute.event';
import { SettingsStore } from '@stores/settings.store';
import {
  ArmorChangedEvent,
  WeaponChangedEvent,
} from '@events/equipment-changed.event';
import { ArmorDefinition } from '@definitions/armor.definition';
import { CharacteristicDefinition } from '@definitions/characteristic.definition';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private mVisibility: VisibilityLiteral;

  private readonly mAfflictedBy: Set<string>;

  private readonly derivedAttributeChanged: Subject<DerivedAttributeEvent>;

  private readonly equipmentChanged: Subject<
    WeaponChangedEvent | ArmorChangedEvent
  >;

  private readonly visibilityChanged: Subject<VisibilityLiteral>;

  protected readonly regeneratorBehavior: RegeneratorBehavior;

  protected readonly aiBehavior: AiBehavior;

  public readonly derivedAttributeChanged$: Observable<DerivedAttributeEvent>;

  public readonly equipmentChanged$: Observable<
    WeaponChangedEvent | ArmorChangedEvent
  >;

  public readonly visibilityChanged$: Observable<VisibilityLiteral>;

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

    this.derivedAttributeChanged = new Subject();

    this.derivedAttributeChanged$ = this.derivedAttributeChanged.asObservable();

    this.equipmentChanged = new Subject();

    this.equipmentChanged$ = this.equipmentChanged.asObservable();

    this.visibilityChanged = new Subject();

    this.visibilityChanged$ = this.visibilityChanged.asObservable();
  }

  public get armorWearing(): ArmorDefinition {
    return this.equipmentBehavior.armorWearing;
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
    const characteristics = this.actorBehavior.characteristics;

    const agi = this.actorBehavior.characteristics.AGI;

    const agiValue = this.minimumValue(
      agi.value -
        SettingsStore.settings.armorPenalty[this.armorWearing.armorPenalty].AGI
    );

    const AGI = new CharacteristicDefinition(agi.key, agiValue);

    return { ...characteristics, AGI };
  }

  public get derivedAttributes(): DerivedAttributeSetDefinition {
    return this.actorBehavior.derivedAttributes;
  }

  public get skills(): KeyValueInterface<number> {
    const weaponQuality = this.weaponEquipped.quality;

    const actorSkills = this.actorBehavior.skills;

    const weaponSkillName = this.weaponEquipped.skillName;

    const weaponSkillValue = this.minimumValue(
      this.actorBehavior.skills[this.weaponEquipped.skillName] +
        SettingsStore.settings.weaponQuality[weaponQuality]
    );

    const dodgeValue = this.minimumValue(
      this.actorBehavior.skills['Dodge'] -
        SettingsStore.settings.armorPenalty[this.armorWearing.armorPenalty]
          .Dodge
    );

    return {
      ...actorSkills,
      [weaponSkillName]: weaponSkillValue,
      ['Dodge']: dodgeValue,
    };
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
    return this.changeWeaponEquipped(weapon);
  }

  public unEquip(): WeaponDefinition | null {
    return this.changeWeaponEquipped();
  }

  public wear(armor: ArmorDefinition): ArmorDefinition | null {
    return this.changeArmorWearing(armor);
  }

  public strip(): ArmorDefinition | null {
    return this.changeArmorWearing();
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
    const result = this.actorBehavior.effectReceived(
      effect,
      this.armorWearing.damageReduction
    );

    let resultLog: string | null;

    if (result.effective) {
      this.derivedAttributeChanged.next(result);

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

    return `${resultLog}${result.detailsToStr()}`;
  }

  private energy(energy: number): string | null {
    const result = this.actorBehavior.energyChange(energy);

    let resultLog: string | null;

    if (result.effective) {
      this.derivedAttributeChanged.next(result);
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
      this.derivedAttributeChanged.next(result);
    }
  }

  private minimumValue(value: number): number {
    return value > 0 ? value : 1;
  }

  private changeWeaponEquipped(
    weapon?: WeaponDefinition
  ): WeaponDefinition | null {
    const previous = this.equipmentBehavior.changeWeapon(weapon);

    if (weapon || previous) {
      this.equipmentChanged.next(
        new WeaponChangedEvent(
          previous ?? unarmedWeapon,
          weapon ?? unarmedWeapon
        )
      );
    }

    return previous;
  }

  private changeArmorWearing(armor?: ArmorDefinition): ArmorDefinition | null {
    const previous = this.equipmentBehavior.changeArmor(armor);

    if (armor || previous) {
      this.equipmentChanged.next(
        new ArmorChangedEvent(previous ?? clothArmor, armor ?? clothArmor)
      );
    }

    return previous;
  }
}

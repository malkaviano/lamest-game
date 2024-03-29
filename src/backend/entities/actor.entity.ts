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
import { CharacteristicValues } from '@values/characteristic.value';
import { DerivedAttributeValues } from '@values/derived-attribute.value';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ReactionValues } from '@values/reaction.value';
import { SceneActorsInfoValues } from '@values/scene-actors.value';
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
import { emptyState } from '@states/empty.state';
import { CooldownBehavior } from '@behaviors/cooldown.behavior';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  private readonly mAfflictedBy: Set<string>;

  private readonly derivedAttributeChanged: Subject<DerivedAttributeEvent>;

  private readonly equipmentChanged: Subject<
    WeaponChangedEvent | ArmorChangedEvent
  >;

  protected readonly regeneratorBehavior: RegeneratorBehavior;

  protected readonly aiBehavior: AiBehavior;

  protected readonly cooldownBehavior: CooldownBehavior;

  protected dodgeEnabled: boolean;

  public readonly derivedAttributeChanged$: Observable<DerivedAttributeEvent>;

  public readonly equipmentChanged$: Observable<
    WeaponChangedEvent | ArmorChangedEvent
  >;

  constructor(
    identity: ActorIdentityDefinition,
    currentState: ActionableState,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior,
    protected readonly lootState: ActionableState,
    behaviors: {
      readonly regeneratorBehavior: RegeneratorBehavior;
      readonly aiBehavior: AiBehavior;
      readonly cooldownBehavior: CooldownBehavior;
    }
  ) {
    super(
      identity.id,
      identity.name,
      identity.description,
      currentState,
      false,
      identity.visibility
    );

    this.regeneratorBehavior = behaviors.regeneratorBehavior;

    this.regeneratorBehavior.apRegenerated$.subscribe((ap) =>
      this.apRecovered(ap)
    );

    this.aiBehavior = behaviors.aiBehavior;

    this.cooldownBehavior = behaviors.cooldownBehavior;

    this.mAfflictedBy = new Set();

    this.derivedAttributeChanged = new Subject();

    this.derivedAttributeChanged$ = this.derivedAttributeChanged.asObservable();

    this.equipmentChanged = new Subject();

    this.equipmentChanged$ = this.equipmentChanged.asObservable();

    this.dodgeEnabled = false;
  }

  public set dodge(enabled: boolean) {
    this.dodgeEnabled = enabled;
  }

  public get armorWearing(): ArmorDefinition {
    return this.equipmentBehavior.armorWearing;
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

  public get characteristics(): CharacteristicValues {
    const characteristics = this.actorBehavior.characteristics;

    const agi = this.actorBehavior.characteristics.AGI;

    const agiValue = this.minimumValue(
      agi.value -
        SettingsStore.settings.armorPenalty[this.armorWearing.armorPenalty].AGI
    );

    const AGI = new CharacteristicDefinition(agi.key, agiValue);

    return { ...characteristics, AGI };
  }

  public get derivedAttributes(): DerivedAttributeValues {
    return this.actorBehavior.derivedAttributes;
  }

  public get skills(): ReadonlyKeyValueWrapper<number> {
    const weaponQuality = this.weaponEquipped.quality;

    const actorSkills = this.actorBehavior.skills;

    const weaponSkillName = this.weaponEquipped.skillName;

    const weaponSkillValue = this.minimumValue(
      this.actorBehavior.skills[this.weaponEquipped.skillName] +
        SettingsStore.settings.weaponQuality[weaponQuality]
    );

    const dodgeSkillName = SettingsStore.settings.systemSkills.dodgeSkill;

    const dodgeValue = this.minimumValue(
      this.actorBehavior.skills[dodgeSkillName] -
        SettingsStore.settings.armorPenalty[this.armorWearing.armorPenalty]
          .DodgeSkill
    );

    return {
      ...actorSkills,
      [weaponSkillName]: weaponSkillValue,
      [dodgeSkillName]: dodgeValue,
    };
  }

  public get cooldowns(): ReadonlyKeyValueWrapper<number> {
    return this.cooldownBehavior.cooldowns;
  }

  public wannaDodge(effect: EffectTypeLiteral): boolean {
    return this.dodgeEnabled && this.actorBehavior.wannaDodge(effect);
  }

  public action(
    sceneActorsInfo: ArrayView<SceneActorsInfoValues>
  ): ActionableEvent | null {
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
    values: ReactionValues
  ): string | null {
    const { actionable } = action;

    let resultHPLog: string | null = null;

    let resultEPLog: string | null = null;

    let reactResult: string | null = null;

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
        reactResult = logs.join(' and ');
      }
    } else if (this.currentState !== emptyState) {
      reactResult = super.reactTo(action, result, values);
    }

    return reactResult;
  }

  public apSpent(apSpent: number): void {
    this.apChange(-apSpent);
  }

  public apRecovered(apRecovered: number): void {
    this.apChange(apRecovered);
  }

  public addCooldown(key: string, durationMilliseconds: number): void {
    this.cooldownBehavior.addCooldown(key, durationMilliseconds);
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
        this.publish(this.currentState.actions, this.lootState.actions);

        this.currentState = this.lootState;
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

      this.regeneratorBehavior.startApRegeneration();
    } else {
      this.regeneratorBehavior.stopApRegeneration();
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

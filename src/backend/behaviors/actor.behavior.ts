import { CharacteristicValues } from '@values/characteristic.value';
import { DerivedAttributeValues } from '@values/derived-attribute.value';
import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { MathHelper } from '@helpers/math.helper';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { EffectEvent } from '@events/effect.event';
import { SkillStore } from '@stores/skill.store';
import { SettingsStore } from '@stores/settings.store';
import { DamageReductionDefinition } from '@definitions/damage-reduction.definition';
import {
  CurrentAPChangedEvent,
  CurrentEPChangedEvent,
  CurrentHPChangedEvent,
} from '@events/derived-attribute.event';

export class ActorBehavior {
  private currentHP: number;

  private currentEP: number;

  private currentAP: number;

  private constructor(
    private readonly mCharacteristics: CharacteristicValues,
    private readonly mSkills: Map<string, number>,
    private readonly skillStore: SkillStore
  ) {
    this.currentHP = this.maximumHP();

    this.currentEP = this.maximumEP();

    this.currentAP = this.maximumAP();
  }

  public get characteristics(): CharacteristicValues {
    return { ...this.mCharacteristics };
  }

  public get derivedAttributes(): DerivedAttributeValues {
    return {
      'MAX HP': new DerivedAttributeDefinition('MAX HP', this.maximumHP()),
      'MAX EP': new DerivedAttributeDefinition('MAX EP', this.maximumEP()),
      'CURRENT HP': new DerivedAttributeDefinition(
        'CURRENT HP',
        this.currentHP
      ),
      'CURRENT EP': new DerivedAttributeDefinition(
        'CURRENT EP',
        this.currentEP
      ),
      'MAX AP': new DerivedAttributeDefinition('MAX AP', this.maximumAP()),
      'CURRENT AP': new DerivedAttributeDefinition(
        'CURRENT AP',
        this.currentAP
      ),
    };
  }

  public get skills(): ReadonlyKeyValueWrapper<number> {
    return Array.from(this.mSkills.entries()).reduce(
      (obj: { [key: string]: number }, [k, v]) => {
        const skill = this.skillStore.skills[k];

        const influence = skill.influenced.reduce((acc, name) => {
          acc += this.characteristics[name].value;

          return acc;
        }, 0);

        obj[k] = v + influence;

        return obj;
      },
      {}
    );
  }

  public get situation(): ActorSituationLiteral {
    return this.currentHP > 0 ? 'ALIVE' : 'DEAD';
  }

  public get dodgesPerRound(): number {
    const dodges = Math.trunc(
      this.characteristics.AGI.value /
        SettingsStore.settings.oneDodgeEveryAgiAmount
    );

    return MathHelper.clamp(dodges, 1, Number.MAX_VALUE);
  }

  public wannaDodge(effect: EffectTypeLiteral): boolean {
    return !(
      SettingsStore.settings.playerEffectDefenses.immunities.items.some(
        (i) => i === effect
      ) ||
      SettingsStore.settings.playerEffectDefenses.cures.items.some(
        (i) => i === effect
      )
    );
  }

  public effectReceived(
    effectReceived: EffectEvent,
    reduction: DamageReductionDefinition
  ): CurrentHPChangedEvent {
    const { effectType, amount } = effectReceived;

    const { value, deflected } = this.deflect(amount, reduction[effectType]);

    let ignored = 0;
    let amplified = 0;
    let resisted = 0;

    const cureModifier =
      SettingsStore.settings.playerEffectDefenses.cures.items.includes(
        effectType
      )
        ? 1
        : -1;

    if (
      SettingsStore.settings.playerEffectDefenses.immunities.items.includes(
        effectType
      )
    ) {
      ignored = amount;
    } else {
      if (
        SettingsStore.settings.playerEffectDefenses.vulnerabilities.items.includes(
          effectType
        )
      ) {
        amplified = Math.trunc(
          amount * SettingsStore.settings.vulnerabilityCoefficient
        );
      }

      if (
        SettingsStore.settings.playerEffectDefenses.resistances.items.includes(
          effectType
        )
      ) {
        resisted = Math.trunc(
          amount * SettingsStore.settings.resistanceCoefficient
        );
      }
    }

    const final = (value - ignored + amplified - resisted) * cureModifier;

    const previousHP = this.modifyHealth(final);

    return new CurrentHPChangedEvent(previousHP, this.currentHP, {
      ignored,
      amplified,
      deflected,
      resisted,
    });
  }

  public energyChange(energy: number): CurrentEPChangedEvent {
    const previousEP = this.currentEP;

    this.currentEP += energy;

    this.currentEP = MathHelper.clamp(this.currentEP, 0, this.maximumEP());

    return new CurrentEPChangedEvent(previousEP, this.currentEP);
  }

  public actionPointsChange(ap: number): CurrentAPChangedEvent {
    const previousAP = this.currentAP;

    this.currentAP += ap;

    this.currentAP = MathHelper.clamp(this.currentAP, 0, this.maximumAP());

    return new CurrentAPChangedEvent(previousAP, this.currentAP);
  }

  public static create(
    characteristics: CharacteristicValues,
    skills: Map<string, number>,
    skillStore: SkillStore
  ): ActorBehavior {
    return new ActorBehavior(characteristics, skills, skillStore);
  }

  private modifyHealth(modified: number): number {
    const previousHP = this.currentHP;

    this.currentHP += modified;

    this.currentHP = MathHelper.clamp(this.currentHP, 0, this.maximumHP());

    return previousHP;
  }

  private maximumHP(): number {
    return Math.trunc(
      (this.characteristics.VIT.value + this.characteristics.STR.value) / 2
    );
  }

  private maximumEP(): number {
    return this.characteristics.ESN.value;
  }

  private maximumAP(): number {
    return (
      SettingsStore.settings.actionPoints.base +
      Math.trunc(
        this.characteristics.AGI.value /
          SettingsStore.settings.actionPoints.oneEveryAgility
      )
    );
  }

  private deflect(amount: number, reduction: number) {
    const value = amount > reduction ? amount - reduction : 0;

    const deflected = amount - value;

    return { value, deflected };
  }
}

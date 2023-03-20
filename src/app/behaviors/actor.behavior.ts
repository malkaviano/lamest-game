import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { EffectEvent } from '../events/effect.event';
import { EnergyPointsEvent } from '../events/energy-points.event';
import { HitPointsEvent } from '../events/hit-points.event';
import { MathHelper } from '../helpers/math.helper';
import { ActorSettingsInterface } from '../interfaces/actor-settings.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { SkillStore } from '../stores/skill.store';

export class ActorBehavior {
  private readonly maximumHP: number;

  private readonly maximumEP: number;

  private currentHP: number;

  private currentEP: number;

  private constructor(
    private readonly mCharacteristics: CharacteristicSetDefinition,
    private readonly mSkills: Map<string, number>,
    private readonly skillStore: SkillStore,
    private readonly actorSettings: ActorSettingsInterface
  ) {
    this.maximumHP = Math.trunc(
      (this.characteristics.VIT.value + this.characteristics.STR.value) / 2
    );

    this.maximumEP = this.characteristics.ESN.value;

    this.currentHP = this.maximumHP;

    this.currentEP = this.maximumEP;
  }

  public get characteristics(): CharacteristicSetDefinition {
    return Object.assign({}, this.mCharacteristics);
  }

  public get derivedAttributes(): DerivedAttributeSetDefinition {
    return {
      HP: new DerivedAttributeDefinition('HP', this.currentHP),
      EP: new DerivedAttributeDefinition('EP', this.currentEP),
      MOV: new DerivedAttributeDefinition('MOV', 10),
    };
  }

  public get skills(): KeyValueInterface<number> {
    return Array.from(this.mSkills.entries()).reduce(
      (acc: { [key: string]: number }, [k, v]) => {
        const base = this.skillStore.skills[k].base(this.characteristics);

        acc[k] = v + base;

        return acc;
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
        this.actorSettings.oneDodgesEveryAgiAmount
    );

    return MathHelper.clamp(dodges, 1, Number.MAX_VALUE);
  }

  public wannaDodge(effect: EffectTypeLiteral): boolean {
    return !(
      this.actorSettings.effectDefenses.immunities.items.some(
        (i) => i === effect
      ) ||
      this.actorSettings.effectDefenses.cures.items.some((i) => i === effect)
    );
  }

  public effectReceived(effectReceived: EffectEvent): HitPointsEvent {
    const { effectType, amount } = effectReceived;

    let value = 0;

    if (
      !this.actorSettings.effectDefenses.immunities.items.includes(effectType)
    ) {
      const isCure =
        this.actorSettings.effectDefenses.cures.items.includes(effectType);

      const isVulnerable =
        this.actorSettings.effectDefenses.vulnerabilities.items.includes(
          effectType
        );

      if (isCure) {
        value += amount;
      } else {
        value -= isVulnerable
          ? amount * this.actorSettings.vulnerabilityCoefficient
          : amount;
      }

      if (
        this.actorSettings.effectDefenses.resistances.items.includes(effectType)
      ) {
        value += value * this.actorSettings.resistanceCoefficient * -1;
      }
    }

    return this.modifyHealth(Math.trunc(value));
  }

  public energyChange(energy: number): EnergyPointsEvent {
    const previousEP = this.currentEP;

    this.currentEP += energy;

    this.currentEP = MathHelper.clamp(this.currentEP, 0, this.maximumEP);

    return new EnergyPointsEvent(previousEP, this.currentEP);
  }

  public static create(
    characteristics: CharacteristicSetDefinition,
    skills: Map<string, number>,
    skillStore: SkillStore,
    actorSettings: ActorSettingsInterface
  ): ActorBehavior {
    return new ActorBehavior(
      characteristics,
      skills,
      skillStore,
      actorSettings
    );
  }

  private modifyHealth(modified: number): HitPointsEvent {
    const previousHP = this.currentHP;

    this.currentHP += modified;

    this.currentHP = MathHelper.clamp(this.currentHP, 0, this.maximumHP);

    return new HitPointsEvent(previousHP, this.currentHP);
  }
}

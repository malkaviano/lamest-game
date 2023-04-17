import { CharacteristicSetDefinition } from '../../core/definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../../core/definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../../core/definitions/derived-attribute.definition';
import { MathHelper } from '../../core/helpers/math.helper';
import { ActorSettingsInterface } from '../../core/interfaces/actor-settings.interface';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';
import { ActorSituationLiteral } from '../../core/literals/actor-situation.literal';
import { EffectTypeLiteral } from '../../core/literals/effect-type.literal';
import { SkillStore } from '../stores/skill.store';
import { EffectEvent } from '../../core/events/effect.event';
import { HitPointsEvent } from '../../core/events/hit-points.event';
import { EnergyPointsEvent } from '../../core/events/energy-points.event';

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
      'MAX HP': new DerivedAttributeDefinition('MAX HP', this.maximumHP),
      'MAX EP': new DerivedAttributeDefinition('MAX EP', this.maximumEP),
      'CURRENT HP': new DerivedAttributeDefinition(
        'CURRENT HP',
        this.currentHP
      ),
      'CURRENT EP': new DerivedAttributeDefinition(
        'CURRENT EP',
        this.currentEP
      ),
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

import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { EffectReceivedDefinition } from '../definitions/effect-received.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { EffectDefensesInterface } from '../interfaces/effect-defenses.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { SkillStore } from '../stores/skill.store';

type EffectCoeficientsInterface = {
  readonly vulnerabilityCoefficient: number;
  readonly resistanceCoefficient: number;
};
export class ActorBehavior {
  private readonly maximumHP: number;

  private readonly maximumPP: number;

  private currentHP: number;

  private currentPP: number;

  private constructor(
    private readonly mCharacteristics: CharacteristicSetDefinition,
    private readonly mSkills: Map<string, number>,
    private readonly skillStore: SkillStore,
    private readonly effectDefenses: EffectDefensesInterface,
    private readonly effectCoeficients: EffectCoeficientsInterface
  ) {
    this.maximumHP = Math.trunc(
      (this.characteristics.VIT.value + this.characteristics.STR.value) / 2
    );

    this.maximumPP = this.characteristics.ESN.value;

    this.currentHP = this.maximumHP;

    this.currentPP = this.maximumPP;
  }

  public get characteristics(): CharacteristicSetDefinition {
    return Object.assign({}, this.mCharacteristics);
  }

  public get derivedAttributes(): DerivedAttributeSetDefinition {
    return {
      HP: new DerivedAttributeDefinition('HP', this.currentHP),
      EP: new DerivedAttributeDefinition('EP', this.currentPP),
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

  public effectReceived(
    effectReceived: EffectReceivedDefinition
  ): HitPointsEvent {
    const { effectType, amount } = effectReceived;

    let value = 0;

    if (!this.effectDefenses.immunities.items.includes(effectType)) {
      const isCure = this.effectDefenses.cures.items.includes(effectType);

      const isVulnerable =
        this.effectDefenses.vulnerabilities.items.includes(effectType);

      if (isCure) {
        value += amount;
      } else {
        value -= isVulnerable
          ? amount * this.effectCoeficients.vulnerabilityCoefficient
          : amount;
      }

      if (this.effectDefenses.resistances.items.includes(effectType)) {
        value += value * this.effectCoeficients.resistanceCoefficient * -1;
      }
    }

    return this.modifyHealth(value);
  }

  public static create(
    characteristics: CharacteristicSetDefinition,
    skills: Map<string, number>,
    skillStore: SkillStore,
    effectDefenses: EffectDefensesInterface,
    effectCoeficients: EffectCoeficientsInterface
  ): ActorBehavior {
    return new ActorBehavior(
      characteristics,
      skills,
      skillStore,
      effectDefenses,
      effectCoeficients
    );
  }

  private modifyHealth(modified: number): HitPointsEvent {
    const previousHP = this.currentHP;

    this.currentHP += modified;

    this.currentHP = this.clamp(this.currentHP, 0, this.maximumHP);

    return new HitPointsEvent(previousHP, this.currentHP);
  }

  // TODO: Move this to helper
  private clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}

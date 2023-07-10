import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '@definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { MathHelper } from '../../backend/helpers/math.helper';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { EffectEvent } from '../events/effect.event';
import { HitPointsEvent } from '../events/hit-points.event';
import { EnergyPointsEvent } from '../events/energy-points.event';
import { SkillStore } from '../../stores/skill.store';
import { SettingsStore } from '../../stores/settings.store';
import { ActionPointsEvent } from '../events/action-points.event';

export class ActorBehavior {
  private readonly maximumHP: number;

  private readonly maximumEP: number;

  private readonly maximumAP: number;

  private currentHP: number;

  private currentEP: number;

  private currentAP: number;

  private constructor(
    private readonly mCharacteristics: CharacteristicSetDefinition,
    private readonly mSkills: Map<string, number>,
    private readonly skillStore: SkillStore
  ) {
    this.maximumHP = Math.trunc(
      (this.characteristics.VIT.value + this.characteristics.STR.value) / 2
    );

    this.maximumEP = this.characteristics.ESN.value;

    this.maximumAP = 10;

    this.currentHP = this.maximumHP;

    this.currentEP = this.maximumEP;

    this.currentAP = this.maximumAP;
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
      'MAX AP': new DerivedAttributeDefinition('MAX AP', this.maximumAP),
      'CURRENT AP': new DerivedAttributeDefinition(
        'CURRENT AP',
        this.currentAP
      ),
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

  public effectReceived(effectReceived: EffectEvent): HitPointsEvent {
    const { effectType, amount } = effectReceived;

    let value = 0;

    if (
      !SettingsStore.settings.playerEffectDefenses.immunities.items.includes(
        effectType
      )
    ) {
      const isCure =
        SettingsStore.settings.playerEffectDefenses.cures.items.includes(
          effectType
        );

      const isVulnerable =
        SettingsStore.settings.playerEffectDefenses.vulnerabilities.items.includes(
          effectType
        );

      if (isCure) {
        value += amount;
      } else {
        value -= isVulnerable
          ? amount * SettingsStore.settings.vulnerabilityCoefficient
          : amount;
      }

      if (
        SettingsStore.settings.playerEffectDefenses.resistances.items.includes(
          effectType
        )
      ) {
        value += value * SettingsStore.settings.resistanceCoefficient * -1;
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

  public actionPointsChange(ap: number): ActionPointsEvent {
    const previousAP = this.currentAP;

    this.currentAP += ap;

    this.currentAP = MathHelper.clamp(this.currentAP, 0, this.maximumAP);

    return new ActionPointsEvent(previousAP, this.currentAP);
  }

  public static create(
    characteristics: CharacteristicSetDefinition,
    skills: Map<string, number>,
    skillStore: SkillStore
  ): ActorBehavior {
    return new ActorBehavior(characteristics, skills, skillStore);
  }

  private modifyHealth(modified: number): HitPointsEvent {
    const previousHP = this.currentHP;

    this.currentHP += modified;

    this.currentHP = MathHelper.clamp(this.currentHP, 0, this.maximumHP);

    return new HitPointsEvent(previousHP, this.currentHP);
  }
}

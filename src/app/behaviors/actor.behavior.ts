import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { EffectReceivedDefinition } from '../definitions/effect-received.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { GameSettingsInterface } from '../interfaces/game-settings.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { SkillStore } from '../stores/skill.store';

export class ActorBehavior {
  private readonly maximumHP: number;

  private readonly maximumPP: number;

  private currentHP: number;

  private currentPP: number;

  private constructor(
    private readonly mCharacteristics: CharacteristicSetDefinition,
    private readonly mSkills: Map<string, number>,
    private readonly skillStore: SkillStore,
    private readonly gameSettings: GameSettingsInterface
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

  public get dodgesPerRound(): number {
    const dodges = Math.trunc(
      this.characteristics.AGI.value / this.gameSettings.oneDodgesEveryAgiAmount
    );

    return this.clamp(dodges, 1, Number.MAX_VALUE);
  }

  public effectReceived(
    effectReceived: EffectReceivedDefinition
  ): HitPointsEvent {
    const { effectType, amount } = effectReceived;

    let value = 0;

    if (
      !this.gameSettings.playerEffectDefenses.immunities.items.includes(
        effectType
      )
    ) {
      const isCure =
        this.gameSettings.playerEffectDefenses.cures.items.includes(effectType);

      const isVulnerable =
        this.gameSettings.playerEffectDefenses.vulnerabilities.items.includes(
          effectType
        );

      if (isCure) {
        value += amount;
      } else {
        value -= isVulnerable
          ? amount * this.gameSettings.vulnerabilityCoefficient
          : amount;
      }

      if (
        this.gameSettings.playerEffectDefenses.resistances.items.includes(
          effectType
        )
      ) {
        value += value * this.gameSettings.resistanceCoefficient * -1;
      }
    }

    return this.modifyHealth(Math.trunc(value));
  }

  public static create(
    characteristics: CharacteristicSetDefinition,
    skills: Map<string, number>,
    skillStore: SkillStore,
    gameSettings: GameSettingsInterface
  ): ActorBehavior {
    return new ActorBehavior(characteristics, skills, skillStore, gameSettings);
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

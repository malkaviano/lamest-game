import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { skillDefinitions } from '../definitions/skill.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';

export class ActorBehavior implements ActorInterface {
  private readonly maximumHP: number;

  private readonly maximumPP: number;

  private currentHP: number;

  private currentPP: number;

  constructor(
    private readonly mCharacteristics: CharacteristicSetDefinition,
    private readonly mSkills: Map<SkillNameLiteral, number>
  ) {
    this.maximumHP = Math.trunc(
      (this.characteristics['CON'].value + this.characteristics['SIZ'].value) /
        2
    );

    this.maximumPP = this.characteristics['POW'].value;

    this.currentHP = this.maximumHP;

    this.currentPP = this.maximumPP;
  }

  get characteristics(): CharacteristicSetDefinition {
    return Object.assign({}, this.mCharacteristics);
  }

  get derivedAttributes(): DerivedAttributeSetDefinition {
    return {
      HP: new DerivedAttributeDefinition('HP', this.currentHP),
      PP: new DerivedAttributeDefinition('PP', this.currentPP),
      MOV: new DerivedAttributeDefinition('MOV', 10),
    };
  }

  get skills(): KeyValueInterface<number> {
    return Array.from(this.mSkills.entries()).reduce(
      (acc: { [key: string]: number }, [k, v]) => {
        const base = skillDefinitions[k].base(this.characteristics);

        acc[k] = v + base;

        return acc;
      },
      {}
    );
  }

  public damaged(damage: number): HitPointsEvent {
    return this.modifyHealth(-damage);
  }

  public healed(healed: number): HitPointsEvent {
    return this.modifyHealth(healed);
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

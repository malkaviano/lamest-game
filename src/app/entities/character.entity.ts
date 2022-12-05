import { Observable, Subject } from 'rxjs';

import { IdentityDefinition } from '../definitions/identity.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { skillDefinitions } from '../definitions/skill.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { ActorInterface } from '../interfaces/actor.interface';

export class CharacterEntity implements ActorInterface {
  private readonly maximumHP: number;

  private readonly maximumPP: number;

  private currentHP: number;

  private currentPP: number;

  private readonly hpChanged: Subject<HitPointsEvent>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  constructor(
    public readonly identity: IdentityDefinition,
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

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();
  }

  public get characteristics(): CharacteristicSetDefinition {
    return Object.assign({}, this.mCharacteristics);
  }

  public get derivedAttributes(): DerivedAttributeSetDefinition {
    return {
      HP: new DerivedAttributeDefinition('HP', this.currentHP),
      PP: new DerivedAttributeDefinition('PP', this.currentPP),
      MOV: new DerivedAttributeDefinition('MOV', 10),
    };
  }

  public get skills(): KeyValueInterface<number> {
    return Array.from(this.mSkills.entries()).reduce(
      (acc: { [key: string]: number }, [k, v]) => {
        const base = skillDefinitions[k].base(this.characteristics);

        acc[k] = v + base;

        return acc;
      },
      {}
    );
  }

  public copy(
    values: {
      identity?: IdentityDefinition;
      characteristics?: CharacteristicSetDefinition;
      skills?: Map<SkillNameLiteral, number>;
    } = {}
  ): CharacterEntity {
    return new CharacterEntity(
      values.identity ?? this.identity,
      values.characteristics ?? this.characteristics,
      values.skills ?? this.mSkills
    );
  }

  public damaged(damage: number): number {
    return this.modifyHealth(-damage);
  }

  public healed(healed: number): number {
    return this.modifyHealth(healed);
  }

  private modifyHealth(modified: number): number {
    const previousHP = this.currentHP;

    this.currentHP += modified;

    this.currentHP = this.clamp(this.currentHP, 0, this.maximumHP);

    if (previousHP !== this.currentHP) {
      this.hpChanged.next(new HitPointsEvent(previousHP, this.currentHP));
    }

    return Math.abs(previousHP - this.currentHP);
  }

  // TODO: Move this to helper
  private clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}

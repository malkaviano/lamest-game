import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { skillDefinitions } from '../definitions/skill.definition';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { Observable, Subject } from 'rxjs';
import { HitPointsEvent } from '../events/hitpoints.event';

export class CharacterEntity {
  private readonly maximumHP: number;

  private readonly maximumPP: number;

  private currentHP: number;

  private currentPP: number;

  private readonly hpChanged: Subject<HitPointsEvent>;

  public readonly hpChanged$: Observable<HitPointsEvent>;

  constructor(
    public readonly identity: IdentityDefinition,
    public readonly characteristics: CharacteristicsDefinition,
    private readonly mSkills: Map<SkillNameLiteral, number>
  ) {
    this.maximumHP = Math.trunc(
      (this.characteristics.con.value + this.characteristics.siz.value) / 2
    );

    this.maximumPP = this.characteristics.pow.value;

    this.currentHP = this.maximumHP;

    this.currentPP = this.maximumPP;

    this.hpChanged = new Subject();

    this.hpChanged$ = this.hpChanged.asObservable();
  }

  public get derivedAttributes(): DerivedAttributesDefinition {
    return new DerivedAttributesDefinition(
      new DerivedAttributeDefinition('HP', this.currentHP),
      new DerivedAttributeDefinition('PP', this.currentPP),
      new DerivedAttributeDefinition('MOV', 10)
    );
  }

  public get skills(): KeyValueInterface<number> {
    return Array.from(this.mSkills.entries()).reduce((acc: any, [k, v]) => {
      const base = skillDefinitions[k].base(this.characteristics);

      acc[k] = v + base;

      return acc;
    }, {});
  }

  public copy(
    values: {
      identity?: IdentityDefinition;
      characteristics?: CharacteristicsDefinition;
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

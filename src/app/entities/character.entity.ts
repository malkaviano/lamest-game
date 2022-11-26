import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { skillDefinitions } from '../definitions/skill.definition';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { Observable, Subject } from 'rxjs';

export class CharacterEntity {
  private readonly maximumHP: number;

  private readonly maximumPP: number;

  private currentHP: number;

  private currentPP: number;

  private readonly hpChanged: Subject<number>;

  public readonly hpChanged$: Observable<number>;

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

  public damaged(damage: number): string {
    this.modifyHealth(-damage);

    let log = `received ${damage} damage`;

    if (this.currentHP === 0) {
      log += ' and was killed';
    }

    return log;
  }

  public healed(healed: number): string {
    this.modifyHealth(healed);

    let log = `healed ${healed} Hit Points`;

    if (this.currentHP === this.maximumHP) {
      log += ' and become full health';
    }

    return log;
  }

  private modifyHealth(modified: number): void {
    const oldHP = this.currentHP;

    this.currentHP += modified;

    this.currentHP = this.clamp(this.currentHP, 0, this.maximumHP);

    if (oldHP !== this.currentHP) {
      this.hpChanged.next(this.currentHP - oldHP);
    }
  }

  // TODO: Move this to helper
  private clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}

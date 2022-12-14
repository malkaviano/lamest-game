import { MagazineBehavior } from '../../behaviors/magazine.behavior';
import { MagazineInterface } from '../../interfaces/magazine.interface';
import { SkillNameLiteral } from '../../literals/skill-name.literal';
import { WeaponUsabilityLiteral } from '../../literals/weapon-usability';
import { ItemIdentityDefinition } from '../../definitions/item-identity.definition';
import { DamageDefinition } from '../../definitions/damage.definition';
import { WeaponDefinition } from '../../definitions/weapon.definition';
import { MagazineDefinition } from '../../definitions/magazine.definition';

export class FirearmValueObject extends WeaponDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    skillName: SkillNameLiteral,
    damage: DamageDefinition,
    dodgeable: boolean,
    usability: WeaponUsabilityLiteral,
    private readonly magazineBehavior: MagazineBehavior
  ) {
    super('FIREARM', identity, skillName, damage, dodgeable, usability);
  }

  public get magazine(): MagazineInterface | null {
    return this.magazineBehavior.info();
  }

  public reload(newMagazine: MagazineDefinition): MagazineDefinition | null {
    return this.magazineBehavior.reload(newMagazine);
  }
}

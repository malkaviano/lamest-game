import { SkillNameLiteral } from '../../literals/skill-name.literal';
import { WeaponUsabilityLiteral } from '../../literals/weapon-usability';
import { DamageDefinition } from '../../definitions/damage.definition';
import { createDice } from '../../definitions/dice.definition';
import { ItemIdentityDefinition } from '../../definitions/item-identity.definition';
import { WeaponDefinition } from '../../definitions/weapon.definition';

export class ManualWeaponValueObject extends WeaponDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    skillName: SkillNameLiteral,
    damage: DamageDefinition,
    dodgeable: boolean,
    usability: WeaponUsabilityLiteral
  ) {
    super('WEAPON', identity, skillName, damage, dodgeable, usability);
  }
}

export const unarmedWeapon = new ManualWeaponValueObject(
  new ItemIdentityDefinition('unarmed', 'Unarmed', 'Actor Natural Weapon'),
  'Brawl',
  new DamageDefinition(createDice({ D4: 1 }), 0),
  true,
  'PERMANENT'
);

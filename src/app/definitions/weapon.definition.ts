import { WeaponUsabilityLiteral } from '../literals/weapon-usability';
import { DamageDefinition } from './damage.definition';
import { createDice } from './dice.definition';
import { ItemIdentityDefinition } from './item-identity.definition';
import { SkillItemDefinition } from './skill-item.definition';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    skillName: string,
    public readonly damage: DamageDefinition,
    public readonly dodgeable: boolean,
    public readonly usability: WeaponUsabilityLiteral
  ) {
    super('WEAPON', identity, skillName);
  }
}

export const unarmedWeapon = new WeaponDefinition(
  new ItemIdentityDefinition('unarmed', 'Unarmed', 'Actor Natural Weapon'),
  'Brawl',
  new DamageDefinition(createDice({ D4: 1 }), 0, 'KINETIC'),
  true,
  'PERMANENT'
);

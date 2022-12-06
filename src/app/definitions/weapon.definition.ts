import { SkillNameLiteral } from '../literals/skill-name.literal';
import { WeaponUsabilityLiteral } from '../literals/weapon-usability';
import { DamageDefinition } from './damage.definition';
import { createDice } from './dice.definition';
import { SkillItemDefinition } from './skill-item.definition';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    name: string,
    label: string,
    description: string,
    skillName: SkillNameLiteral,
    public readonly damage: DamageDefinition,
    public readonly dodgeable: boolean,
    public readonly usability: WeaponUsabilityLiteral
  ) {
    super('WEAPON', name, label, description, skillName);
  }
}

export const unarmed = new WeaponDefinition(
  'unarmed',
  'Bare hands',
  'Unarmed combat',
  'Brawl',
  new DamageDefinition(createDice({ D4: 1 }), 0),
  true,
  'PERMANENT'
);

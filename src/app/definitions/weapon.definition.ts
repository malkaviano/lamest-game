import { SkillNameLiteral } from '../literals/skill-name.literal';
import { DamageDefinition } from './damage.definition';
import { createDice } from './dice.definition';
import { SkillItemDefinition } from './skill-item.definition';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    name: string,
    label: string,
    description: string,
    skillName: SkillNameLiteral,
    public readonly damage: DamageDefinition
  ) {
    super('WEAPON', name, label, description, skillName);
  }
}

export const unarmed = new WeaponDefinition(
  'unarmed',
  'Bare hands',
  'Unarmed combat',
  'Brawl',
  new DamageDefinition(createDice({ D4: 1 }), 0)
);

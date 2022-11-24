import { SkillNameLiteral } from '../literals/skill-name.literal';
import { DamageDefinition } from './damage.definition';
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

import { SkillNameLiteral } from '../literals/skill-name.literal';
import { SkillItemDefinition } from './skill-item.definition';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    name: string,
    label: string,
    description: string,
    skillName: SkillNameLiteral
  ) {
    super('WEAPON', name, label, description, skillName);
  }
}

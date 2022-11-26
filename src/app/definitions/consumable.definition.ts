import { SkillNameLiteral } from '../literals/skill-name.literal';
import { GameItemDefinition } from './game-item.definition';

export class ConsumableDefinition extends GameItemDefinition {
  constructor(
    name: string,
    label: string,
    description: string,
    public readonly hp: number,
    public readonly skillName?: SkillNameLiteral
  ) {
    super('CONSUMABLE', name, label, description);
  }
}

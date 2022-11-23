import { GameItemLiteral } from '../literals/game-item.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { GameItemDefinition } from './game-item.definition';

export abstract class SkillItemDefinition extends GameItemDefinition {
  constructor(
    category: GameItemLiteral,
    name: string,
    label: string,
    description: string,
    public readonly skillName: SkillNameLiteral
  ) {
    super(category, name, label, description);
  }
}

import { GameItemLiteral } from '../literals/game-item.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ItemIdentityDefinition } from './item-identity.definition';
import { GameItemDefinition } from './game-item.definition';

export abstract class SkillItemDefinition extends GameItemDefinition {
  constructor(
    category: GameItemLiteral,
    identity: ItemIdentityDefinition,
    public readonly skillName: SkillNameLiteral
  ) {
    super(category, identity);
  }
}

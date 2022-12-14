import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ItemIdentityDefinition } from './item-identity.definition';
import { GameItemDefinition } from './game-item.definition';

export class ConsumableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    public readonly hp: number,
    public readonly skillName?: SkillNameLiteral
  ) {
    super('CONSUMABLE', identity);
  }
}

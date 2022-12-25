import { GameItemLiteral } from '../literals/game-item.literal';

import { ItemIdentityDefinition } from './item-identity.definition';
import { GameItemDefinition } from './game-item.definition';
import { ItemUsabilityLiteral } from '../literals/item-usability';

export abstract class SkillItemDefinition extends GameItemDefinition {
  constructor(
    category: GameItemLiteral,
    identity: ItemIdentityDefinition,
    public readonly skillName: string,
    usability: ItemUsabilityLiteral
  ) {
    super(category, identity, usability);
  }
}

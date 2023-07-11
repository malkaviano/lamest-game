import { GameItemLiteral } from '@literals/game-item.literal';

import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemUsabilityLiteral } from '@literals/item-usability';

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

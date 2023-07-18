import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { GameItemLiteral } from '@literals/game-item.literal';
import { ItemQualityLiteral } from '@literals/item-quality.literal';
import { ItemUsabilityLiteral } from '@literals/item-usability';

export abstract class SkillItemDefinition extends GameItemDefinition {
  constructor(
    category: GameItemLiteral,
    identity: ItemIdentityDefinition,
    public readonly skillName: string,
    usability: ItemUsabilityLiteral,
    public readonly quality: ItemQualityLiteral
  ) {
    super(category, identity, usability);
  }
}

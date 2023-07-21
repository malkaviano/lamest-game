import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { ItemUsabilityLiteral } from '@literals/item-usability';

export class UsableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    usability: ItemUsabilityLiteral,
    public readonly skillName?: string
  ) {
    super('USABLE', identity, usability);
  }
}

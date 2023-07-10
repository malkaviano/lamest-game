import { ItemIdentityDefinition } from './item-identity.definition';
import { GameItemDefinition } from './game-item.definition';
import { ItemUsabilityLiteral } from '@literals/item-usability';

export class UsableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    usability: ItemUsabilityLiteral
  ) {
    super('USABLE', identity, usability);
  }
}

import { ItemIdentityDefinition } from './item-identity.definition';
import { GameItemDefinition } from './game-item.definition';

export class UsableItemDefinition extends GameItemDefinition {
  constructor(identity: ItemIdentityDefinition) {
    super('USABLE', identity);
  }
}

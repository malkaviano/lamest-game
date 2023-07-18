import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { ItemUsabilityLiteral } from '@literals/item-usability';
import { ArrayView } from '@wrappers/array.view';

export class ReadableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    public readonly title: string,
    public readonly text: ArrayView<string>,
    usability: ItemUsabilityLiteral
  ) {
    super('READABLE', identity, usability);
  }
}

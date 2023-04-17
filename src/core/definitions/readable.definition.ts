import { ItemUsabilityLiteral } from '../literals/item-usability';
import { ArrayView } from '../../core/view-models/array.view';
import { GameItemDefinition } from './game-item.definition';
import { ItemIdentityDefinition } from './item-identity.definition';

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

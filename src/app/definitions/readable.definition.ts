import { ArrayView } from '../views/array.view';
import { GameItemDefinition } from './game-item.definition';
import { ItemIdentityDefinition } from './item-identity.definition';

export class ReadableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    public readonly title: string,
    public readonly text: ArrayView<string>
  ) {
    super('READABLE', identity);
  }
}
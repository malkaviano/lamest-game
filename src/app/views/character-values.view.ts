import { ArrayView } from './array.view';
import { KeyValueDescriptionView } from './key-value-description.view';

export class CharacterValuesView {
  constructor(
    public readonly identity: ArrayView<KeyValueDescriptionView>,
    public readonly characteristics: ArrayView<KeyValueDescriptionView>,
    public readonly derivedAttributes: ArrayView<KeyValueDescriptionView>,
    public readonly skills: ArrayView<KeyValueDescriptionView>
  ) {}
}
import { ArrayView } from '../views/array.view';
import { KeyValueDescriptionDefinition } from './key-value-description.definition';

export class CharacterValuesDefinition {
  constructor(
    public readonly identity: ArrayView<KeyValueDescriptionDefinition>,
    public readonly characteristics: ArrayView<KeyValueDescriptionDefinition>,
    public readonly derivedAttributes: ArrayView<KeyValueDescriptionDefinition>,
    public readonly skills: ArrayView<KeyValueDescriptionDefinition>
  ) {}
}

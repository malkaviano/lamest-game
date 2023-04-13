import { ArrayView } from './array.view';
import { KeyValueDescriptionView } from './key-value-description.view';

export class CharacterValuesView {
  private constructor(
    public readonly identity: ArrayView<KeyValueDescriptionView>,
    public readonly characteristics: ArrayView<KeyValueDescriptionView>,
    public readonly derivedAttributes: ArrayView<KeyValueDescriptionView>,
    public readonly skills: ArrayView<KeyValueDescriptionView>
  ) {}

  public static create(
    identity: ArrayView<KeyValueDescriptionView>,
    characteristics: ArrayView<KeyValueDescriptionView>,
    derivedAttributes: ArrayView<KeyValueDescriptionView>,
    skills: ArrayView<KeyValueDescriptionView>
  ): CharacterValuesView {
    return new CharacterValuesView(
      identity,
      characteristics,
      derivedAttributes,
      skills
    );
  }
}

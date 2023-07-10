import { KeyValueDescriptionView } from './key-value-description.view';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ArrayView } from '@wrappers/array.view';

export class CharacterStatusView {
  private constructor(
    public readonly derivedAttributes: ArrayView<KeyValueDescriptionView>,
    public readonly weapon: GameItemDefinition,
    public readonly visibility: KeyValueDescriptionView
  ) {}

  public static create(
    derivedAttributes: ArrayView<KeyValueDescriptionView>,
    weapon: GameItemDefinition,
    visibility: KeyValueDescriptionView
  ): CharacterStatusView {
    return new CharacterStatusView(derivedAttributes, weapon, visibility);
  }
}
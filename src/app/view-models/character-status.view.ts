import { GameItemDefinition } from '../definitions/game-item.definition';
import { ArrayView } from './array.view';
import { KeyValueDescriptionView } from './key-value-description.view';

export class CharacterStatusView {
  private constructor(
    public readonly derivedAttributes: ArrayView<KeyValueDescriptionView>,
    public readonly weapon: GameItemDefinition,
    public readonly visibility: string
  ) {}

  public static create(
    derivedAttributes: ArrayView<KeyValueDescriptionView>,
    weapon: GameItemDefinition,
    visibility: string
  ): CharacterStatusView {
    return new CharacterStatusView(derivedAttributes, weapon, visibility);
  }
}

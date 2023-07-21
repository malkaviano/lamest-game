import { KeyValueDescriptionView } from './key-value-description.view';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ArrayView } from '@wrappers/array.view';

export class CharacterStatusView {
  private constructor(
    public readonly playerId: string,
    public readonly derivedAttributes: ArrayView<KeyValueDescriptionView>,
    public readonly weapon: GameItemDefinition,
    public readonly armor: GameItemDefinition,
    public readonly visibility: KeyValueDescriptionView
  ) {}

  public static create(
    playerId: string,
    derivedAttributes: ArrayView<KeyValueDescriptionView>,
    weapon: GameItemDefinition,
    armor: GameItemDefinition,
    visibility: KeyValueDescriptionView
  ): CharacterStatusView {
    return new CharacterStatusView(
      playerId,
      derivedAttributes,
      weapon,
      armor,
      visibility
    );
  }
}

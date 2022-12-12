import { GameItemDefinition } from '../definitions/game-item.definition';

export interface ReactionValuesInterface {
  readonly damage?: number;
  readonly heal?: number;
  readonly item?: GameItemDefinition;
}

import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameItemDefinition } from '@definitions/game-item.definition';

export interface PolicyResultInterface {
  readonly visibility?: {
    readonly actor?: VisibilityLiteral;
    readonly target?: VisibilityLiteral;
  };
  readonly actionPointsSpent?: number;
  readonly disposed?: GameItemDefinition;
}

import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameItemDefinition } from '@definitions/game-item.definition';

export type PolicyResult = {
  readonly visibility?: {
    readonly actor?: VisibilityLiteral;
    readonly target?: VisibilityLiteral;
  };
  readonly actorActionPointsSpent?: number;
  readonly targetActionPointsSpent?: number;
  readonly disposed?: GameItemDefinition;
};

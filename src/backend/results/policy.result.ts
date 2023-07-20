import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { InteractiveInterface } from '@interfaces/interactive.interface';

export type PolicyResult = {
  readonly visibility?: {
    readonly actor?: VisibilityLiteral;
    readonly target?: VisibilityLiteral;
  };
  readonly actorActionPointsSpent?: number;
  readonly targetActionPointsSpent?: number;
  readonly disposed?: GameItemDefinition;
  readonly dead?: ActorInterface;
  readonly affected?: InteractiveInterface;
};

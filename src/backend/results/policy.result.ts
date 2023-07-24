import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ArrayView } from '@wrappers/array.view';

export type PolicyResult = {
  readonly visibility?: {
    readonly actor?: VisibilityLiteral;
    readonly target?: VisibilityLiteral;
    readonly detected: ArrayView<string>;
  };
  readonly actorActionPointsSpent?: number;
  readonly targetActionPointsSpent?: number;
  readonly disposed?: GameItemDefinition;
  readonly dead?: ActorInterface;
  readonly affected?: InteractiveInterface;
  readonly cooldown?: {
    readonly name: string;
    readonly duration: number;
    readonly target: boolean;
  };
};

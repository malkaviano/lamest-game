import { EffectEvent } from '../events/effect.event';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ActorVisibilityInterface } from './actor-visibility.interface';
import { ActionReactiveInterface } from './action-reactive.interface';

export interface ReactionValuesInterface {
  readonly item?: GameItemDefinition;
  readonly effect?: EffectEvent;
  readonly energy?: number;
  readonly actorVisibility?: ActorVisibilityInterface;
  readonly target?: ActionReactiveInterface;
}

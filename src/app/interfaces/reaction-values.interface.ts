import { EffectEvent } from '../events/effect.event';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ActorVisibilityInterface } from './actor-visibility.interface';

export interface ReactionValuesInterface {
  readonly item?: GameItemDefinition;
  readonly effect?: EffectEvent;
  readonly energy?: number;
  readonly actorVisibility?: ActorVisibilityInterface;
}

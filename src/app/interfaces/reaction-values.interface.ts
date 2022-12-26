import { EffectEvent } from '../events/effect.event';
import { GameItemDefinition } from '../definitions/game-item.definition';
import { ActionReactiveInterface } from './action-reactive.interface';
import { ActorInterface } from './actor.interface';

export interface ReactionValuesInterface {
  readonly item?: GameItemDefinition;
  readonly effect?: EffectEvent;
  readonly energy?: number;
  readonly actor?: ActorInterface;
  readonly target?: ActionReactiveInterface;
}

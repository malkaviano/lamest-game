import { EffectEvent } from '@events/effect.event';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActorInterface } from '@interfaces/actor.interface';

export type ReactionValuesDefinition = {
  readonly item?: GameItemDefinition;
  readonly effect?: EffectEvent;
  readonly energy?: number;
  readonly actor?: ActorInterface;
  readonly target?: InteractiveInterface;
};

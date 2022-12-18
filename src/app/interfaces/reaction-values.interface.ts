import { EffectEvent } from '../events/effect.event';
import { GameItemDefinition } from '../definitions/game-item.definition';

export interface ReactionValuesInterface {
  readonly item?: GameItemDefinition;
  readonly effect?: EffectEvent;
  readonly energyGain?: number;
}

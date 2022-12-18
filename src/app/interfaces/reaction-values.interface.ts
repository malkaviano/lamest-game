import { EffectReceivedDefinition } from '../definitions/effect-received.definition';
import { GameItemDefinition } from '../definitions/game-item.definition';

export interface ReactionValuesInterface {
  readonly item?: GameItemDefinition;
  readonly effect?: EffectReceivedDefinition;
  readonly energyGained?: number;
}

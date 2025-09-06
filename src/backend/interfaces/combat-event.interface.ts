import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { LogCategoryLiteral } from '@literals/log-category.literal';

export type CombatOutcome = 'HIT' | 'CRIT' | 'MISS' | 'DODGE' | 'HEAL';

export interface CombatEvent {
  readonly timestamp: number;
  readonly category: LogCategoryLiteral;
  readonly actorId: string;
  readonly actorName: string;
  readonly targetId: string;
  readonly targetName: string;
  readonly effectType?: EffectTypeLiteral;
  readonly amount?: number;
  readonly outcome: CombatOutcome;
}


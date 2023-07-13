import { VisibilityLiteral } from '@literals/visibility.literal';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';

export interface PolicyResultInterface {
  readonly visibility?: {
    readonly actor?: VisibilityLiteral;
    readonly target?: VisibilityLiteral;
  };
  readonly actionPointsSpent?: number;
  readonly disposed?: WeaponDefinition;
  readonly consumed?: ConsumableDefinition;
  readonly dropped?: GameItemDefinition;
}

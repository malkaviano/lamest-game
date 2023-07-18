import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { EffectTypeLiteral } from '@literals/effect-type.literal';

export class ConsumableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    public readonly hp: number,
    public readonly energy: number,
    public readonly effect: EffectTypeLiteral,
    public readonly skillName?: string
  ) {
    super('CONSUMABLE', identity, 'DISPOSABLE');
  }
}

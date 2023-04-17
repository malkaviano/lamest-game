import { ItemIdentityDefinition } from './item-identity.definition';
import { GameItemDefinition } from './game-item.definition';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { ItemUsabilityLiteral } from '../literals/item-usability';

export class ConsumableDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    public readonly hp: number,
    public readonly energy: number,
    public readonly effect: EffectTypeLiteral,
    usability: ItemUsabilityLiteral,
    public readonly skillName?: string
  ) {
    super('CONSUMABLE', identity, usability);
  }
}

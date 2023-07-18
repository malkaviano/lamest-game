import { DamageReductionDefinition } from '@definitions/damage-reduction.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { ArmorPenaltyLiteral } from '@literals/armor-penalty.literal';
import { ItemUsabilityLiteral } from '@literals/item-usability';

export class ArmorDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    usability: ItemUsabilityLiteral,
    public readonly damageReduction: DamageReductionDefinition,
    public readonly armorPenalty: ArmorPenaltyLiteral
  ) {
    super('ARMOR', identity, usability);
  }
}

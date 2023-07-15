import { ItemUsabilityLiteral } from '@literals/item-usability';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ArmorPenaltyLiteral } from '@literals/armor-penalty.literal';
import { DamageReductionInterface } from '@interfaces/damage-reduction.interface';

export class ArmorDefinition extends GameItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    usability: ItemUsabilityLiteral,
    public readonly damageReduction: DamageReductionInterface,
    public readonly armorPenalty: ArmorPenaltyLiteral
  ) {
    super('ARMOR', identity, usability);
  }
}

import { ItemUsabilityLiteral } from '@literals/item-usability';
import { EffectDefinition } from '@definitions/effect.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { SkillItemDefinition } from '@definitions/skill-item.definition';
import { ItemQualityLiteral } from '@literals/item-quality.literal';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    skillName: string,
    public readonly damage: EffectDefinition,
    public readonly dodgeable: boolean,
    usability: ItemUsabilityLiteral,
    public readonly energyActivation: number,
    quality: ItemQualityLiteral
  ) {
    super('WEAPON', identity, skillName, usability, quality);
  }
}

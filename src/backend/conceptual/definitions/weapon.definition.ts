import { ItemUsabilityLiteral } from '@literals/item-usability';
import { EffectDefinition } from '@definitions/effect.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { SkillItemDefinition } from '@definitions/skill-item.definition';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    skillName: string,
    public readonly damage: EffectDefinition,
    public readonly dodgeable: boolean,
    usability: ItemUsabilityLiteral,
    public readonly energyActivation: number
  ) {
    super('WEAPON', identity, skillName, usability);
  }
}

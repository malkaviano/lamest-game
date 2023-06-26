import { ItemUsabilityLiteral } from '../literals/item-usability';
import { EffectDefinition } from './effect.definition';
import { ItemIdentityDefinition } from './item-identity.definition';
import { SkillItemDefinition } from './skill-item.definition';

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

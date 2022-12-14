import { GameItemLiteral } from '../literals/game-item.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { WeaponUsabilityLiteral } from '../literals/weapon-usability';
import { DamageDefinition } from './damage.definition';
import { ItemIdentityDefinition } from './item-identity.definition';
import { SkillItemDefinition } from './skill-item.definition';

export abstract class WeaponDefinition extends SkillItemDefinition {
  constructor(
    category: GameItemLiteral,
    identity: ItemIdentityDefinition,
    skillName: SkillNameLiteral,
    public readonly damage: DamageDefinition,
    public readonly dodgeable: boolean,
    public readonly usability: WeaponUsabilityLiteral
  ) {
    super(category, identity, skillName);
  }
}

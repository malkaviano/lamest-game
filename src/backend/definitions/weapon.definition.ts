import { ItemUsabilityLiteral } from '../literals/item-usability';
import { GameStringsStore } from '../stores/game-strings.store';
import { DamageDefinition } from './damage.definition';
import { createDice } from './dice.definition';
import { ItemIdentityDefinition } from './item-identity.definition';
import { SkillItemDefinition } from './skill-item.definition';

export class WeaponDefinition extends SkillItemDefinition {
  constructor(
    identity: ItemIdentityDefinition,
    skillName: string,
    public readonly damage: DamageDefinition,
    public readonly dodgeable: boolean,
    usability: ItemUsabilityLiteral,
    public readonly energyActivation: number
  ) {
    super('WEAPON', identity, skillName, usability);
  }
}

export const unarmedWeapon = new WeaponDefinition(
  new ItemIdentityDefinition(
    'unarmed',
    'Unarmed',
    GameStringsStore.descriptions['UNARMED']
  ),
  'Brawl',
  new DamageDefinition(createDice({ D4: 1 }), 0, 'KINETIC'),
  true,
  'PERMANENT',
  0
);

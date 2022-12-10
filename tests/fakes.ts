import { createActionableDefinition } from '../src/app/definitions/actionable.definition';
import { CharacteristicSetDefinition } from '../src/app/definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '../src/app/definitions/characteristic.definition';
import { ConsumableDefinition } from '../src/app/definitions/consumable.definition';
import { DamageDefinition } from '../src/app/definitions/damage.definition';
import { DerivedAttributeSetDefinition } from '../src/app/definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../src/app/definitions/derived-attribute.definition';
import { createDice } from '../src/app/definitions/dice.definition';
import { CharacterIdentityDefinition } from '../src/app/definitions/character-identity.definition';
import { WeaponDefinition } from '../src/app/definitions/weapon.definition';
import { ActionableEvent } from '../src/app/events/actionable.event';
import { KeyValueInterface } from '../src/app/interfaces/key-value.interface';
import { SceneActorsInfoInterface } from '../src/app/interfaces/scene-actors.interface';
import { SkillNameLiteral } from '../src/app/literals/skill-name.literal';
import { ArrayView } from '../src/app/views/array.view';

export const simpleSword = new WeaponDefinition(
  'sword',
  'Sword',
  'some sword',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice(), 2),
  true,
  'PERMANENT'
);

export const greatSword = new WeaponDefinition(
  'greatSword',
  'Great Sword',
  'Some Great Sword',
  'Melee Weapon (Great)',
  new DamageDefinition(createDice(), 6),
  true,
  'PERMANENT'
);

export const unDodgeableAxe = new WeaponDefinition(
  'axe',
  'Axe',
  'UnDodgeable Axe',
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice(), 2),
  false,
  'PERMANENT'
);

export const molotov = new WeaponDefinition(
  'molotov',
  'Molotov',
  'Homemade Bomb',
  'Ranged Weapon (Throw)',
  new DamageDefinition(createDice(), 2),
  false,
  'DISPOSABLE'
);

export const actionEquip = createActionableDefinition(
  'EQUIP',
  'equip',
  'Equip'
);

export const actionConsume = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

export const bubbleGum = new ConsumableDefinition(
  'bubbleGum',
  'Bubble Gum',
  'That is a bubble gum',
  1
);

export const actionAttack = createActionableDefinition(
  'ATTACK',
  'attack',
  'Attack'
);

export const attackEvent = new ActionableEvent(actionAttack, 'id1');

export const attackPlayerEvent = new ActionableEvent(actionAttack, 'player');

export const actionPick = createActionableDefinition('PICK', 'name1', 'label1');

export const fakeCharacteristics: CharacteristicSetDefinition = {
  STR: new CharacteristicDefinition('STR', 8),
  CON: new CharacteristicDefinition('CON', 9),
  SIZ: new CharacteristicDefinition('SIZ', 10),
  DEX: new CharacteristicDefinition('DEX', 11),
  INT: new CharacteristicDefinition('INT', 12),
  POW: new CharacteristicDefinition('POW', 13),
  APP: new CharacteristicDefinition('APP', 14),
};

export const fakeDerivedAttributes: DerivedAttributeSetDefinition = {
  HP: new DerivedAttributeDefinition('HP', 9),
  PP: new DerivedAttributeDefinition('PP', 13),
  MOV: new DerivedAttributeDefinition('MOV', 10),
};

export const fakeSkills: KeyValueInterface<number> = {
  'First Aid': 45,
  'Melee Weapon (Simple)': 45,
  Brawl: 45,
};

export const fakeMapSkills: Map<SkillNameLiteral, number> = new Map<
  SkillNameLiteral,
  number
>([
  ['First Aid', 45],
  ['Melee Weapon (Simple)', 45],
  ['Brawl', 45],
]);

export const fakeIdentity = new CharacterIdentityDefinition(
  'Some Name',
  'Police Detective',
  'YOUNG',
  'HUMAN',
  'SHORT',
  'LIGHT'
);

export const fakeSceneActorsInfo: ArrayView<SceneActorsInfoInterface> =
  new ArrayView([
    {
      id: 'player',
      classification: 'PLAYER',
      situation: 'ALIVE',
    },
  ]);

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
import { CharacterValuesDefinition } from '../src/app/definitions/character-values.definition';
import { KeyValueDescriptionDefinition } from '../src/app/definitions/key-value-description.definition';

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

export const actionAsk = createActionableDefinition(
  'ASK',
  'action1',
  'Got action?'
);

export const actionHeal = createActionableDefinition('HEAL', 'heal', 'Heal');

export const fakeCharacteristics: CharacteristicSetDefinition = {
  STR: new CharacteristicDefinition('STR', 8),
  VIT: new CharacteristicDefinition('VIT', 9),
  AGI: new CharacteristicDefinition('AGI', 11),
  INT: new CharacteristicDefinition('INT', 12),
  ESN: new CharacteristicDefinition('ESN', 13),
  APP: new CharacteristicDefinition('APP', 14),
};

export const fakeDerivedAttributes: DerivedAttributeSetDefinition = {
  HP: new DerivedAttributeDefinition('HP', 8),
  EP: new DerivedAttributeDefinition('EP', 13),
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

export const fakeCharacterSheetIdentity = new ArrayView([
  new KeyValueDescriptionDefinition('NAME', 'Some Name', 'Character name'),
  new KeyValueDescriptionDefinition(
    'PROFESSION',
    'Police Detective',
    'Character profession'
  ),
  new KeyValueDescriptionDefinition('AGE', 'YOUNG', 'Character age'),
  new KeyValueDescriptionDefinition('RACE', 'HUMAN', 'Character race'),
  new KeyValueDescriptionDefinition('HEIGHT', 'SHORT', 'Character height'),
  new KeyValueDescriptionDefinition('WEIGHT', 'LIGHT', 'Character weight'),
]);

export const fakeCharacterSheetCharacteristics = new ArrayView([
  new KeyValueDescriptionDefinition('STR', '8', 'The character physical force'),
  new KeyValueDescriptionDefinition('VIT', '9', 'The character vitality'),
  new KeyValueDescriptionDefinition('AGI', '11', 'The character agility'),
  new KeyValueDescriptionDefinition('INT', '12', 'The character intelligence'),
  new KeyValueDescriptionDefinition('ESN', '13', 'The character essence'),
  new KeyValueDescriptionDefinition('APP', '14', 'The character looks'),
]);

export const fakeCharacterSheetDerivedAttributes = new ArrayView([
  new KeyValueDescriptionDefinition('HP', '8', 'The character hit points'),
  new KeyValueDescriptionDefinition('EP', '13', 'The character essence points'),
  new KeyValueDescriptionDefinition('MOV', '10', 'The character movement'),
]);

export const fakeCharacterSheetSkills = new ArrayView([
  new KeyValueDescriptionDefinition(
    'Brawl',
    '45',
    'Fighting with bare hands and martial arts'
  ),
  new KeyValueDescriptionDefinition('First Aid', '45', ''),
  new KeyValueDescriptionDefinition('Melee Weapon (Simple)', '45', ''),
]);

export const fakeCharacterSheet = new CharacterValuesDefinition(
  fakeCharacterSheetIdentity,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetSkills
);

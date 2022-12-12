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
import { DiscardState } from '../src/app/states/discard.state';
import { UsableItemDefinition } from '../src/app/definitions/usable-item.definition';

export const playerInfo = { id: 'player', name: 'player' };

export const interactiveInfo = { id: 'id1', name: 'test' };

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

export const eventAttackInteractive = new ActionableEvent(
  actionAttack,
  interactiveInfo.id
);

export const eventAttackPlayer = new ActionableEvent(
  actionAttack,
  playerInfo.id
);

export const actionPickBubbleGum = createActionableDefinition(
  'PICK',
  'bubbleGum',
  'Bubble Gum'
);

export const actionAsk = createActionableDefinition(
  'INTERACTION',
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
      id: playerInfo.id,
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
  new KeyValueDescriptionDefinition('Brawl', '45', 'Fighting unarmed'),
  new KeyValueDescriptionDefinition(
    'First Aid',
    '45',
    'Use emergency kit to heal'
  ),
  new KeyValueDescriptionDefinition(
    'Melee Weapon (Simple)',
    '45',
    'Light close combat weapons, one handed'
  ),
]);

export const fakeCharacterSheet = new CharacterValuesDefinition(
  fakeCharacterSheetIdentity,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetSkills
);

export const lootState = new DiscardState(new ArrayView([actionPickBubbleGum]));

export const consumableFirstAid = new ConsumableDefinition(
  'firstAid',
  'First Aid Kit',
  'Very simple First Aid',
  5,
  'First Aid'
);

export const consumableChesseBurger = new ConsumableDefinition(
  'sandwich',
  'Cheeseburger',
  'Delicious',
  2
);

export const actionConsume = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

export const eventConsumeFirstAid = new ActionableEvent(
  actionConsume,
  consumableFirstAid.name
);

export const eventConsumeCheeseBurger = new ActionableEvent(
  actionConsume,
  consumableChesseBurger.name
);

export const eventEquipUnDodgeableAxe = new ActionableEvent(
  actionEquip,
  unDodgeableAxe.name
);

export const actionSceneExit = createActionableDefinition(
  'SCENE',
  'exit',
  'Exit'
);

export const eventSceneExit = new ActionableEvent(
  actionSceneExit,
  'sceneExitDoor'
);

export const actionSkillAthleticism = createActionableDefinition(
  'SKILL',
  'athleticism',
  'Athleticism'
);

export const eventSkillAthleticism = new ActionableEvent(
  actionSkillAthleticism,
  'athleticism'
);

export const masterKey = new UsableItemDefinition(
  'masterKey',
  'Master Key',
  'Opens stuff'
);

export const actionUseMasterKey = createActionableDefinition(
  'USE',
  masterKey.name,
  masterKey.label
);

export const actionWrongUseSimpleSword = createActionableDefinition(
  'USE',
  simpleSword.name,
  simpleSword.label
);

export const eventUseMasterKey = new ActionableEvent(
  actionUseMasterKey,
  interactiveInfo.id
);

export const eventWrongUseSimpleSword = new ActionableEvent(
  actionWrongUseSimpleSword,
  interactiveInfo.id
);

export const actionPickSimpleSword = createActionableDefinition(
  'PICK',
  simpleSword.name,
  simpleSword.label
);

export const eventPickSimpleSword = new ActionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);

export const actionSkillBrawl = createActionableDefinition('SKILL', 'Brawl');

export const eventSkillBrawl = new ActionableEvent(
  actionSkillBrawl,
  interactiveInfo.id
);

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../src/app/definitions/actionable.definition';
import { CharacteristicSetDefinition } from '../src/app/definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '../src/app/definitions/characteristic.definition';
import { ConsumableDefinition } from '../src/app/definitions/consumable.definition';
import { DamageDefinition } from '../src/app/definitions/damage.definition';
import { DerivedAttributeSetDefinition } from '../src/app/definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../src/app/definitions/derived-attribute.definition';
import { createDice } from '../src/app/definitions/dice.definition';
import { CharacterIdentityDefinition } from '../src/app/definitions/character-identity.definition';
import { ActionableEvent } from '../src/app/events/actionable.event';
import { KeyValueInterface } from '../src/app/interfaces/key-value.interface';
import { SceneActorsInfoInterface } from '../src/app/interfaces/scene-actors.interface';
import { ArrayView } from '../src/app/views/array.view';
import { CharacterValuesDefinition } from '../src/app/definitions/character-values.definition';
import { KeyValueDescriptionDefinition } from '../src/app/definitions/key-value-description.definition';
import { DiscardState } from '../src/app/states/discard.state';
import { UsableItemDefinition } from '../src/app/definitions/usable-item.definition';
import { ItemIdentityDefinition } from '../src/app/definitions/item-identity.definition';
import { ActionableItemView } from '../src/app/views/actionable-item.view';
import { GameItemDefinition } from '../src/app/definitions/game-item.definition';
import { WeaponDefinition } from '../src/app/definitions/weapon.definition';

export const playerInfo = { id: 'player', name: 'player' };

export const interactiveInfo = { id: 'id1', name: 'test' };

export const simpleSword = new WeaponDefinition(
  new ItemIdentityDefinition('sword', 'Sword', 'some sword'),
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice(), 2),
  true,
  'PERMANENT'
);

export const greatSword = new WeaponDefinition(
  new ItemIdentityDefinition('greatSword', 'Great Sword', 'Some Great Sword'),
  'Melee Weapon (Great)',
  new DamageDefinition(createDice(), 6),
  true,
  'PERMANENT'
);

export const unDodgeableAxe = new WeaponDefinition(
  new ItemIdentityDefinition('axe', 'Axe', 'UnDodgeable Axe'),
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice(), 2),
  false,
  'PERMANENT'
);

export const molotov = new WeaponDefinition(
  new ItemIdentityDefinition('molotov', 'Molotov', 'Homemade Bomb'),
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

export const actionUnEquip = (label: string) =>
  createActionableDefinition('UNEQUIP', 'unequip', label);

export const bubbleGum = new ConsumableDefinition(
  new ItemIdentityDefinition('bubbleGum', 'Bubble Gum', 'That is a bubble gum'),
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

export const fakeMapSkills: Map<string, number> = new Map<string, number>([
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
  new ItemIdentityDefinition(
    'firstAid',
    'First Aid Kit',
    'Very simple First Aid'
  ),
  5,
  'First Aid'
);

export const consumableChesseBurger = new ConsumableDefinition(
  new ItemIdentityDefinition('sandwich', 'Cheeseburger', 'Delicious'),
  2
);

export const actionConsume = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

export const eventConsumeFirstAid = new ActionableEvent(
  actionConsume,
  consumableFirstAid.identity.name
);

export const eventConsumeCheeseBurger = new ActionableEvent(
  actionConsume,
  consumableChesseBurger.identity.name
);

export const eventEquipUnDodgeableAxe = new ActionableEvent(
  actionEquip,
  unDodgeableAxe.identity.name
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
  new ItemIdentityDefinition('masterKey', 'Master Key', 'Opens stuff')
);

export const actionUseMasterKey = createActionableDefinition(
  'USE',
  masterKey.identity.name,
  masterKey.identity.label
);

export const actionWrongUseSimpleSword = createActionableDefinition(
  'USE',
  simpleSword.identity.name,
  simpleSword.identity.label
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
  simpleSword.identity.name,
  simpleSword.identity.label
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

export const actionNoop = createActionableDefinition('NOOP', 'noop', 'NOOP');

export const actionableItemView = (
  item: GameItemDefinition,
  action: ActionableDefinition
): ActionableItemView => new ActionableItemView(item, action);

export const actionableEvent = (action: ActionableDefinition, id: string) =>
  new ActionableEvent(action, id);

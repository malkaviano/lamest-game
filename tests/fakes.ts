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
import { CharacterValuesView } from '../src/app/views/character-values.view';
import { KeyValueDescriptionView } from '../src/app/views/key-value-description.view';
import { DiscardState } from '../src/app/states/discard.state';
import { UsableItemDefinition } from '../src/app/definitions/usable-item.definition';
import { ItemIdentityDefinition } from '../src/app/definitions/item-identity.definition';
import { ActionableItemView } from '../src/app/views/actionable-item.view';
import { GameItemDefinition } from '../src/app/definitions/game-item.definition';
import { WeaponDefinition } from '../src/app/definitions/weapon.definition';
import {
  influencedDefinitions,
  SkillDefinition,
} from '../src/app/definitions/skill.definition';
import { EffectReceivedDefinition } from '../src/app/definitions/effect-received.definition';
import { EffectTypeLiteral } from '../src/app/literals/effect-type.literal';

export const playerInfo = { id: 'player', name: 'player' };

export const interactiveInfo = { id: 'id1', name: 'test' };

export const simpleSword = new WeaponDefinition(
  new ItemIdentityDefinition('sword', 'Sword', 'some sword'),
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice(), 2, 'KINETIC'),
  true,
  'PERMANENT'
);

export const greatSword = new WeaponDefinition(
  new ItemIdentityDefinition('greatSword', 'Great Sword', 'Some Great Sword'),
  'Melee Weapon (Great)',
  new DamageDefinition(createDice(), 6, 'KINETIC'),
  true,
  'PERMANENT'
);

export const unDodgeableAxe = new WeaponDefinition(
  new ItemIdentityDefinition('axe', 'Axe', 'UnDodgeable Axe'),
  'Melee Weapon (Simple)',
  new DamageDefinition(createDice(), 2, 'KINETIC'),
  false,
  'PERMANENT'
);

export const molotov = new WeaponDefinition(
  new ItemIdentityDefinition('molotov', 'Molotov', 'Homemade Bomb'),
  'Ranged Weapon (Throw)',
  new DamageDefinition(createDice(), 2, 'FIRE'),
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
  1,
  'REMEDY'
);

export const actionAttack = createActionableDefinition(
  'AFFECT',
  'affect',
  'Use Equipped'
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

export const fakeSkillStore: KeyValueInterface<SkillDefinition> = {
  'First Aid': new SkillDefinition(
    'First Aid',
    'Use emergency kit to heal',
    'NATURAL',
    false,
    influencedDefinitions['justInt']
  ),
  'Melee Weapon (Simple)': new SkillDefinition(
    'Melee Weapon (Simple)',
    'Light close combat weapons, one handed',
    'NATURAL',
    true,
    influencedDefinitions['justStr']
  ),
  Brawl: new SkillDefinition(
    'Brawl',
    'Fighting unarmed',
    'NATURAL',
    true,
    influencedDefinitions['justStr']
  ),
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
  ArrayView.create([
    {
      id: playerInfo.id,
      classification: 'PLAYER',
      situation: 'ALIVE',
    },
  ]);

export const fakeCharacterSheetIdentity = ArrayView.create([
  KeyValueDescriptionView.create('NAME', 'Some Name', 'Character name'),
  KeyValueDescriptionView.create(
    'PROFESSION',
    'Police Detective',
    'Character profession'
  ),
  KeyValueDescriptionView.create('AGE', 'YOUNG', 'Character age'),
  KeyValueDescriptionView.create('RACE', 'HUMAN', 'Character race'),
  KeyValueDescriptionView.create('HEIGHT', 'SHORT', 'Character height'),
  KeyValueDescriptionView.create('WEIGHT', 'LIGHT', 'Character weight'),
]);

export const fakeCharacterSheetCharacteristics = ArrayView.create([
  KeyValueDescriptionView.create('STR', '8', 'The character physical force'),
  KeyValueDescriptionView.create('VIT', '9', 'The character vitality'),
  KeyValueDescriptionView.create('AGI', '11', 'The character agility'),
  KeyValueDescriptionView.create('INT', '12', 'The character intelligence'),
  KeyValueDescriptionView.create('ESN', '13', 'The character essence'),
  KeyValueDescriptionView.create('APP', '14', 'The character looks'),
]);

export const fakeCharacterSheetDerivedAttributes = ArrayView.create([
  KeyValueDescriptionView.create('HP', '8', 'The character hit points'),
  KeyValueDescriptionView.create('EP', '13', 'The character energy points'),
  KeyValueDescriptionView.create('MOV', '10', 'The character movement'),
]);

export const fakeCharacterSheetSkills = ArrayView.create([
  KeyValueDescriptionView.create('Brawl', '45', 'Fighting unarmed'),
  KeyValueDescriptionView.create(
    'First Aid',
    '45',
    'Use emergency kit to heal'
  ),
  KeyValueDescriptionView.create(
    'Melee Weapon (Simple)',
    '45',
    'Light close combat weapons, one handed'
  ),
]);

export const fakeCharacterSheet = CharacterValuesView.create(
  fakeCharacterSheetIdentity,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetSkills
);

export const lootState = new DiscardState(
  ArrayView.create([actionPickBubbleGum])
);

export const consumableFirstAid = new ConsumableDefinition(
  new ItemIdentityDefinition(
    'firstAid',
    'First Aid Kit',
    'Very simple First Aid'
  ),
  5,
  'REMEDY',
  'First Aid'
);

export const consumableAnalgesic = new ConsumableDefinition(
  new ItemIdentityDefinition('analgesic', 'Analgesic', 'Relieves pain'),
  2,
  'REMEDY'
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

export const eventConsumeAnalgesic = new ActionableEvent(
  actionConsume,
  consumableAnalgesic.identity.name
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
): ActionableItemView => ActionableItemView.create(item, action);

export const actionableEvent = (action: ActionableDefinition, id: string) =>
  new ActionableEvent(action, id);

export const fakeEffect = (effectType: EffectTypeLiteral, amount: number) =>
  new EffectReceivedDefinition(effectType, amount);

export const documentOpened = {
  title: 'Testing',
  text: ArrayView.create(['GG man']),
};

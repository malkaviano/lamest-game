import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '@definitions/actionable.definition';
import { CharacterIdentityDefinition } from '@definitions/character-identity.definition';
import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { DerivedAttributeSetDefinition } from '@definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { createDice } from '@definitions/dice.definition';
import { EffectDefinition } from '@definitions/effect.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { SkillDefinition } from '@definitions/skill.definition';
import { UsableDefinition } from '@definitions/usable.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ActionableEvent } from '@events/actionable.event';
import { EffectEvent } from '@events/effect.event';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { SceneActorsInfoInterface } from '@interfaces/scene-actors.interface';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { DiscardState } from '@states/discard.state';
import { ArrayView } from '@wrappers/array.view';
import { CharacterStatusView } from '../src/app/view-models/character-status.view';
import { CharacterValuesView } from '../src/app/view-models/character-values.view';
import { KeyValueDescriptionView } from '../src/app/view-models/key-value-description.view';
import { ArmorDefinition } from '@definitions/armor.definition';

export const playerInfo = { id: 'playerId', name: 'Some Name' };

export const interactiveInfo = { id: 'id1', name: 'test' };

export const actorInfo = { id: 'actorId', name: 'actor' };

export const simpleSword = new WeaponDefinition(
  new ItemIdentityDefinition('sword', 'Sword', 'some sword'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'KINETIC'),
  true,
  'PERMANENT',
  0,
  'COMMON'
);

export const greatSword = new WeaponDefinition(
  new ItemIdentityDefinition('greatSword', 'Great Sword', 'Some Great Sword'),
  'Melee Weapon (Great)',
  new EffectDefinition(createDice(), 6, 'KINETIC'),
  true,
  'PERMANENT',
  0,
  'COMMON'
);

export const unDodgeableAxe = new WeaponDefinition(
  new ItemIdentityDefinition('axe', 'Axe', 'UnDodgeable Axe'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'KINETIC'),
  false,
  'PERMANENT',
  1000,
  'COMMON'
);

export const molotov = new WeaponDefinition(
  new ItemIdentityDefinition('molotov', 'Molotov', 'Homemade Bomb'),
  'Ranged Weapon (Throw)',
  new EffectDefinition(createDice(), 2, 'FIRE'),
  false,
  'DISPOSABLE',
  0,
  'COMMON'
);

export const actionAffect = createActionableDefinition(
  'AFFECT',
  'affect',
  'Use Equipped'
);

export const actionPickAnalgesic = createActionableDefinition(
  'PICK',
  'analgesic',
  'Analgesic'
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
  'MAX HP': new DerivedAttributeDefinition('MAX HP', 8),
  'MAX EP': new DerivedAttributeDefinition('MAX EP', 13),
  'CURRENT HP': new DerivedAttributeDefinition('CURRENT HP', 8),
  'CURRENT EP': new DerivedAttributeDefinition('CURRENT EP', 13),
  'MAX AP': new DerivedAttributeDefinition('MAX AP', 6),
  'CURRENT AP': new DerivedAttributeDefinition('CURRENT AP', 6),
};

export const fakeSkills: KeyValueInterface<number> = {
  'First Aid': 45,
  'Melee Weapon (Simple)': 45,
  Brawl: 45,
};

const str = (characteristics: CharacteristicSetDefinition) =>
  characteristics.STR.value;

const int = (characteristics: CharacteristicSetDefinition) =>
  characteristics.INT.value;

export const fakeSkillStore: KeyValueInterface<SkillDefinition> = {
  'First Aid': new SkillDefinition(
    'First Aid',
    'Use emergency kit to heal',
    'NATURAL',
    false,
    int
  ),
  'Melee Weapon (Simple)': new SkillDefinition(
    'Melee Weapon (Simple)',
    'Light close combat weapons, one handed',
    'NATURAL',
    true,
    str
  ),
  Brawl: new SkillDefinition('Brawl', 'Fighting unarmed', 'NATURAL', true, str),
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
  'LIGHT',
  'VISIBLE'
);

export const fakeSceneActorsInfo: ArrayView<SceneActorsInfoInterface> =
  ArrayView.create({
    id: playerInfo.id,
    classification: 'PLAYER',
    situation: 'ALIVE',
    visibility: 'VISIBLE',
  });

export const fakeCharacterSheetIdentity = ArrayView.create(
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
  KeyValueDescriptionView.create(
    'VISIBILITY',
    'VISIBLE',
    'Character current visibility'
  )
);

export const fakeCharacterSheetCharacteristics = ArrayView.create(
  KeyValueDescriptionView.create('STR', '8', 'The character physical force'),
  KeyValueDescriptionView.create('VIT', '9', 'The character vitality'),
  KeyValueDescriptionView.create('AGI', '11', 'The character agility'),
  KeyValueDescriptionView.create('INT', '12', 'The character intelligence'),
  KeyValueDescriptionView.create('ESN', '13', 'The character essence'),
  KeyValueDescriptionView.create('APP', '14', 'The character looks')
);

export const fakeCharacterSheetDerivedAttributes = ArrayView.create(
  KeyValueDescriptionView.create(
    'MAX HP',
    '8',
    'The character maximum hit points'
  ),
  KeyValueDescriptionView.create(
    'MAX EP',
    '13',
    'The character maximum energy points'
  ),
  KeyValueDescriptionView.create(
    'CURRENT HP',
    '8',
    'The character current hit points'
  ),
  KeyValueDescriptionView.create(
    'CURRENT EP',
    '13',
    'The character current energy points'
  ),
  KeyValueDescriptionView.create(
    'MAX AP',
    '6',
    'The character maximum action points'
  ),
  KeyValueDescriptionView.create(
    'CURRENT AP',
    '6',
    'The character current action points'
  )
);

export const fakeCharacterSheetSkills = ArrayView.create(
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
  )
);

export const fakeCharacterSheet = CharacterValuesView.create(
  fakeCharacterSheetIdentity,
  fakeCharacterSheetCharacteristics,
  fakeCharacterSheetDerivedAttributes,
  fakeCharacterSheetSkills
);

export const lootState = new DiscardState(
  ArrayView.create(actionPickAnalgesic)
);

export const consumableFirstAid = new ConsumableDefinition(
  new ItemIdentityDefinition(
    'firstAid',
    'First Aid Kit',
    'Very simple First Aid'
  ),
  5,
  2,
  'REMEDY',
  'First Aid'
);

export const consumableAnalgesic = new ConsumableDefinition(
  new ItemIdentityDefinition('analgesic', 'Analgesic', 'Relieves pain'),
  2,
  1,
  'REMEDY',
  'DISPOSABLE'
);

export const actionConsume = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

export const actionSceneExit = createActionableDefinition(
  'SCENE',
  'exit',
  'Exit'
);

export const actionSkillAthleticism = createActionableDefinition(
  'SKILL',
  'athleticism',
  'Athleticism'
);

export const masterKey = new UsableDefinition(
  new ItemIdentityDefinition('masterKey', 'Master Key', 'Opens stuff'),
  'DISPOSABLE'
);

export const actionUseMasterKey = createActionableDefinition(
  'USE',
  masterKey.identity.name,
  masterKey.identity.label
);

export const actionPickSimpleSword = createActionableDefinition(
  'PICK',
  simpleSword.identity.name,
  simpleSword.identity.label
);

export const actionSkillSurvival = createActionableDefinition(
  'SKILL',
  'Survival'
);

export const actionableItemView = (
  item: GameItemDefinition,
  action: ActionableDefinition
): ActionableItemDefinition => new ActionableItemDefinition(item, action);

export const actionableEvent = (action: ActionableDefinition, id: string) =>
  new ActionableEvent(action, id);

export const fakeEffect = (effectType: EffectTypeLiteral, amount: number) =>
  new EffectEvent(effectType, amount);

export const documentOpened = {
  title: 'Testing',
  text: ArrayView.create(['GG man']),
};

export const actionRead = createActionableDefinition('READ', 'read', 'Read');

export const readable = new ReadableDefinition(
  new ItemIdentityDefinition('book', 'Book', 'Some book'),
  'BOOK',
  ArrayView.create('GG'),
  'PERMANENT'
);

export const shadowSword = new WeaponDefinition(
  new ItemIdentityDefinition('shadowSword', 'Shadow Sword', 'Unholy Sword'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'PROFANE'),
  true,
  'PERMANENT',
  20,
  'COMMON'
);

export const shadowDagger = new WeaponDefinition(
  new ItemIdentityDefinition('shadowDagger', 'Shadow Dagger', 'Unholy Dagger'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'PROFANE'),
  true,
  'PERMANENT',
  5,
  'COMMON'
);

export const actionDisguise = createActionableDefinition(
  'SKILL',
  'Disguise',
  'Use Disguise'
);

export const actionHide = createActionableDefinition(
  'SKILL',
  'Hide',
  'Use Hide'
);

export const actionDetect = createActionableDefinition(
  'SKILL',
  'Detect',
  'Detect'
);

export const imageOpened = {
  title: 'Testing',
  src: 'some image path',
  alt: 'some image alt',
  width: '400',
  height: '400',
};

export const glock = new WeaponDefinition(
  new ItemIdentityDefinition('glock', 'Glock', 'Glock 17'),
  'Firearm (Handgun)',
  new EffectDefinition(createDice(), 2, 'KINETIC'),
  false,
  'PERMANENT',
  0,
  'COMMON'
);

export const superbSword = new WeaponDefinition(
  new ItemIdentityDefinition('superbSword', 'Superb Sword', 'A Superb Sword'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 4, 'KINETIC'),
  false,
  'PERMANENT',
  0,
  'SUPERB'
);

export const leatherJacket = new ArmorDefinition(
  new ItemIdentityDefinition(
    'leatherJacket',
    'Leather Jacket',
    'Small protection'
  ),
  'PERMANENT',
  {
    ACID: 1,
    FIRE: 1,
    KINETIC: 2,
    PROFANE: 0,
    SACRED: 0,
  },
  'LIGHT'
);

export const kevlarVest = new ArmorDefinition(
  new ItemIdentityDefinition(
    'kevlarVest',
    'Kevlar Vest',
    'Best Kinetic protection'
  ),
  'PERMANENT',
  {
    ACID: 3,
    FIRE: 3,
    KINETIC: 6,
    PROFANE: 0,
    SACRED: 0,
  },
  'MEDIUM'
);

export const fakeCharacterStatusView = CharacterStatusView.create(
  fakeCharacterSheetDerivedAttributes,
  simpleSword,
  leatherJacket,
  KeyValueDescriptionView.create(
    'VISIBILITY',
    'VISIBLE',
    'Character current visibility'
  )
);

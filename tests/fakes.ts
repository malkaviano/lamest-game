import {
  ActionableDefinition,
  createActionableDefinition,
} from '../src/core/definitions/actionable.definition';
import { CharacteristicSetDefinition } from '../src/core/definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '../src/core/definitions/characteristic.definition';
import { ConsumableDefinition } from '../src/core/definitions/consumable.definition';
import { EffectDefinition } from '../src/core/definitions/effect.definition';
import { DerivedAttributeSetDefinition } from '../src/core/definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../src/core/definitions/derived-attribute.definition';
import { createDice } from '../src/core/definitions/dice.definition';
import { CharacterIdentityDefinition } from '../src/core/definitions/character-identity.definition';
import { ActionableEvent } from '../src/core/events/actionable.event';
import { KeyValueInterface } from '../src/core/interfaces/key-value.interface';
import { SceneActorsInfoInterface } from '../src/core/interfaces/scene-actors.interface';
import { ArrayView } from '../src/core/view-models/array.view';
import { CharacterValuesView } from '../src/core/view-models/character-values.view';
import { KeyValueDescriptionView } from '../src/core/view-models/key-value-description.view';
import { DiscardState } from '../src/core/states/discard.state';
import { UsableDefinition } from '../src/core/definitions/usable.definition';
import { ItemIdentityDefinition } from '../src/core/definitions/item-identity.definition';
import { ActionableItemView } from '../src/core/view-models/actionable-item.view';
import { GameItemDefinition } from '../src/core/definitions/game-item.definition';
import { WeaponDefinition } from '../src/core/definitions/weapon.definition';
import { SkillDefinition } from '../src/core/definitions/skill.definition';
import { EffectEvent } from '../src/core/events/effect.event';
import { EffectTypeLiteral } from '../src/core/literals/effect-type.literal';
import { ReadableDefinition } from '../src/core/definitions/readable.definition';
import { GameSettingsInterface } from '../src/core/interfaces/game-settings.interface';
import { ActorSettingsInterface } from '../src/core/interfaces/actor-settings.interface';
import { CharacterStatusView } from '../src/core/view-models/character-status.view';

export const playerInfo = { id: 'playerId', name: 'Some Name' };

export const interactiveInfo = { id: 'id1', name: 'test' };

export const actorInfo = { id: 'actorId', name: 'actor' };

export const simpleSword = new WeaponDefinition(
  new ItemIdentityDefinition('sword', 'Sword', 'some sword'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'KINETIC'),
  true,
  'PERMANENT',
  0
);

export const greatSword = new WeaponDefinition(
  new ItemIdentityDefinition('greatSword', 'Great Sword', 'Some Great Sword'),
  'Melee Weapon (Great)',
  new EffectDefinition(createDice(), 6, 'KINETIC'),
  true,
  'PERMANENT',
  0
);

export const unDodgeableAxe = new WeaponDefinition(
  new ItemIdentityDefinition('axe', 'Axe', 'UnDodgeable Axe'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'KINETIC'),
  false,
  'PERMANENT',
  1000
);

export const molotov = new WeaponDefinition(
  new ItemIdentityDefinition('molotov', 'Molotov', 'Homemade Bomb'),
  'Ranged Weapon (Throw)',
  new EffectDefinition(createDice(), 2, 'FIRE'),
  false,
  'DISPOSABLE',
  0
);

export const actionEquip = createActionableDefinition(
  'EQUIP',
  'equip',
  'Equip'
);

export const actionUnEquip = (label: string) =>
  createActionableDefinition('UNEQUIP', 'unequip', label);

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
  'MAX AP': new DerivedAttributeDefinition('MAX AP', 10),
  'CURRENT AP': new DerivedAttributeDefinition('CURRENT AP', 10),
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
    '10',
    'The character maximum action points'
  ),
  KeyValueDescriptionView.create(
    'CURRENT AP',
    '10',
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

export const actionNoop = createActionableDefinition('NOOP', 'noop', 'NOOP');

export const actionableItemView = (
  item: GameItemDefinition,
  action: ActionableDefinition
): ActionableItemView => ActionableItemView.create(item, action);

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

export const gameSettings: GameSettingsInterface = {
  playerEffectDefenses: {
    immunities: ArrayView.create<EffectTypeLiteral>('ACID'),
    cures: ArrayView.create<EffectTypeLiteral>('REMEDY', 'SACRED'),
    vulnerabilities: ArrayView.create<EffectTypeLiteral>('PROFANE'),
    resistances: ArrayView.create<EffectTypeLiteral>('KINETIC', 'SACRED'),
  },
  resistanceCoefficient: 0.5,
  vulnerabilityCoefficient: 1.5,
  oneDodgesEveryAgiAmount: 8,
  intelligencePoints: 10,
  professionPoints: 300,
  actionCooldown: 0,
};

export const actorSettings: ActorSettingsInterface = {
  effectDefenses: {
    immunities: ArrayView.create<EffectTypeLiteral>('ACID'),
    cures: ArrayView.create<EffectTypeLiteral>('REMEDY', 'SACRED'),
    vulnerabilities: ArrayView.create<EffectTypeLiteral>('PROFANE'),
    resistances: ArrayView.create<EffectTypeLiteral>('KINETIC', 'SACRED'),
  },
  resistanceCoefficient: 0.5,
  vulnerabilityCoefficient: 1.5,
  oneDodgesEveryAgiAmount: 8,
};

export const shadowSword = new WeaponDefinition(
  new ItemIdentityDefinition('shadowSword', 'Shadow Sword', 'Unholy Sword'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'PROFANE'),
  true,
  'PERMANENT',
  20
);

export const shadowDagger = new WeaponDefinition(
  new ItemIdentityDefinition('shadowDagger', 'Shadow Dagger', 'Unholy Dagger'),
  'Melee Weapon (Simple)',
  new EffectDefinition(createDice(), 2, 'PROFANE'),
  true,
  'PERMANENT',
  5
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

export const fakeCharacterStatusView = CharacterStatusView.create(
  fakeCharacterSheetDerivedAttributes,
  simpleSword,
  KeyValueDescriptionView.create(
    'VISIBILITY',
    'VISIBLE',
    'Character current visibility'
  )
);

export const imageOpened = {
  title: 'Testing',
  src: 'some image path',
  alt: 'some image alt',
  width: '400',
  height: '400',
};

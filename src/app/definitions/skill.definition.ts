import { CharacteristicSetDefinition } from './characteristic-set.definition';
import { SkillCategoryLiteral } from '../literals/skill-category.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ArrayView } from '../views/array.view';

export class SkillDefinition {
  constructor(
    public readonly name: SkillNameLiteral,
    public readonly description: string,
    public readonly category: SkillCategoryLiteral,
    public readonly combat: boolean,
    private readonly baseGenerator: (
      characteristics: CharacteristicSetDefinition
    ) => number
  ) {}

  public base(characteristics: CharacteristicSetDefinition): number {
    return this.baseGenerator(characteristics);
  }
}

const justStr = (characteristics: CharacteristicSetDefinition) =>
  characteristics.STR.value;

const justAgi = (characteristics: CharacteristicSetDefinition) =>
  characteristics.AGI.value;

const justInt = (characteristics: CharacteristicSetDefinition) =>
  characteristics.INT.value;

const justEsn = (characteristics: CharacteristicSetDefinition) =>
  characteristics.ESN.value;

const justApp = (characteristics: CharacteristicSetDefinition) =>
  characteristics.APP.value;

const justVit = (characteristics: CharacteristicSetDefinition) =>
  characteristics.VIT.value;

const strPlusAgi = (characteristics: CharacteristicSetDefinition) =>
  justStr(characteristics) + justAgi(characteristics);

const doubleDex = (characteristics: CharacteristicSetDefinition) =>
  justAgi(characteristics) * 2;

const intPlusEsn = (characteristics: CharacteristicSetDefinition) =>
  justInt(characteristics) + justEsn(characteristics);

const intPlusApp = (characteristics: CharacteristicSetDefinition) =>
  justInt(characteristics) + justApp(characteristics);

export const skillDefinitions: {
  readonly [key in SkillNameLiteral]: SkillDefinition;
} = {
  Athleticism: new SkillDefinition(
    'Athleticism',
    'Swim, Jump, Climb and related basic actions',
    'NATURAL',
    false,
    strPlusAgi
  ),
  Endure: new SkillDefinition(
    'Endure',
    'Body resistance against poisons and other internal body attacks',
    'NATURAL',
    false,
    justVit
  ),
  Discipline: new SkillDefinition(
    'Discipline',
    'Mental resistance, willpower and concentration',
    'NATURAL',
    false,
    intPlusEsn
  ),
  Manipulation: new SkillDefinition(
    'Manipulation',
    'Mind and looks working together to mislead others',
    'NATURAL',
    false,
    intPlusApp
  ),
  Appraise: new SkillDefinition('Appraise', '', 'NATURAL', false, justInt),
  'Artillery (Siege)': new SkillDefinition(
    'Artillery (Siege)',
    'Medieval siege weapons',
    'TRAINED',
    false,
    justInt
  ),
  'Artillery (War)': new SkillDefinition(
    'Artillery (War)',
    'Modern artillery weapons and mortars',
    'TRAINED',
    true,
    justInt
  ),
  Bargain: new SkillDefinition('Bargain', '', 'NATURAL', false, justApp),
  Brawl: new SkillDefinition(
    'Brawl',
    'Fighting unarmed',
    'NATURAL',
    true,
    justStr
  ),
  'Craft (Blacksmithing)': new SkillDefinition(
    'Craft (Blacksmithing)',
    'Craft armor and weapons, can be used to make money',
    'TRAINED',
    false,
    justStr
  ),
  'Craft (Cooking)': new SkillDefinition(
    'Craft (Cooking)',
    'Makes healing food, can be used to make money',
    'TRAINED',
    false,
    justInt
  ),
  'Craft (Leatherworking)': new SkillDefinition(
    'Craft (Leatherworking)',
    'Craft armor and items, can be used to make money',
    'TRAINED',
    false,
    justAgi
  ),
  'Craft (Sewing)': new SkillDefinition(
    'Craft (Sewing)',
    'Craft and repair clothes, can be used to make money',
    'TRAINED',
    false,
    justAgi
  ),
  Demolition: new SkillDefinition(
    'Demolition',
    'Use and disarm explosives',
    'TRAINED',
    false,
    justInt
  ),
  Dodge: new SkillDefinition(
    'Dodge',
    'Ability to avoid being hit',
    'NATURAL',
    true,
    doubleDex
  ),
  Disguise: new SkillDefinition('Disguise', '', 'NATURAL', false, justApp),
  'Drive (Automobile)': new SkillDefinition(
    'Drive (Automobile)',
    'Drive motor light vehicles',
    'TRAINED',
    false,
    justInt
  ),
  'Drive (Traction)': new SkillDefinition(
    'Drive (Traction)',
    'Drive animal traction vehicles',
    'TRAINED',
    false,
    justInt
  ),
  'Drive (Heavy Vehicles)': new SkillDefinition(
    'Drive (Heavy Vehicles)',
    'Drive motor heavy vehicles',
    'TRAINED',
    false,
    justInt
  ),
  Etiquette: new SkillDefinition(
    'Etiquette',
    'Knowing and adapting own behavior to the situation',
    'TRAINED',
    false,
    justApp
  ),
  'Engineering (Computer)': new SkillDefinition(
    'Engineering (Computer)',
    'Hardware, software and programming',
    'TRAINED',
    false,
    justInt
  ),
  'Engineering (Electrical)': new SkillDefinition(
    'Engineering (Electrical)',
    'Electric and electronic manipulation of devices',
    'TRAINED',
    false,
    justInt
  ),
  'Engineering (Mechanical)': new SkillDefinition(
    'Engineering (Mechanical)',
    'Combustion motors, operate and repair of non electric devices and simple traps',
    'TRAINED',
    false,
    justInt
  ),
  'Firearm (Handgun)': new SkillDefinition(
    'Firearm (Handgun)',
    'Light firearms, mostly one handed',
    'NATURAL',
    true,
    justAgi
  ),
  'Firearm (Shooter)': new SkillDefinition(
    'Firearm (Shooter)',
    'Heavier firearms, mostly two handed',
    'TRAINED',
    true,
    justAgi
  ),
  'First Aid': new SkillDefinition(
    'First Aid',
    'Use emergency kit to heal',
    'NATURAL',
    false,
    justInt
  ),
  Streetwise: new SkillDefinition(
    'Streetwise',
    'Hearing gossip and making small change on the streets',
    'NATURAL',
    false,
    justInt
  ),
  Hide: new SkillDefinition(
    'Hide',
    'Avoid detection',
    'NATURAL',
    false,
    justEsn
  ),
  'Knowledge (History)': new SkillDefinition(
    'Knowledge (History)',
    'Knowledge of old and contemporary history of the world',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Linguistics)': new SkillDefinition(
    'Knowledge (Linguistics)',
    'Knowledge of other languages',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Occult)': new SkillDefinition(
    'Knowledge (Occult)',
    'Knowledge of the obscure',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Religion)': new SkillDefinition(
    'Knowledge (Religion)',
    'Knowledge of most common religions',
    'TRAINED',
    false,
    justInt
  ),
  'Melee Weapon (Simple)': new SkillDefinition(
    'Melee Weapon (Simple)',
    'Light close combat weapons, one handed',
    'NATURAL',
    true,
    justStr
  ),
  'Melee Weapon (Great)': new SkillDefinition(
    'Melee Weapon (Great)',
    'Heavier close combat weapons, two handed',
    'TRAINED',
    true,
    justStr
  ),
  'Ranged Weapon (Throw)': new SkillDefinition(
    'Ranged Weapon (Throw)',
    'Light throwable light weapons',
    'NATURAL',
    true,
    justAgi
  ),
  'Ranged Weapon (Bow)': new SkillDefinition(
    'Ranged Weapon (Bow)',
    'Bows, crossbows and related',
    'TRAINED',
    true,
    justAgi
  ),
  Performance: new SkillDefinition(
    'Performance',
    'Personification of other',
    'NATURAL',
    false,
    justApp
  ),
  'Pilot (Airplane)': new SkillDefinition(
    'Pilot (Airplane)',
    'Piloting anything that flies',
    'TRAINED',
    false,
    justInt
  ),
  'Pilot (Boat)': new SkillDefinition(
    'Pilot (Boat)',
    'Piloting anything that goes in the sea',
    'TRAINED',
    false,
    justInt
  ),
  Research: new SkillDefinition(
    'Research',
    'Looking for clues on documents and related',
    'NATURAL',
    false,
    justInt
  ),
  'Ride (Horse)': new SkillDefinition(
    'Ride (Horse)',
    'Riding horses and other mountable animals',
    'TRAINED',
    false,
    justAgi
  ),
  'Science(Botany)': new SkillDefinition(
    'Science(Botany)',
    'Knowledge about plants, natural remedies and venoms',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Chemistry)': new SkillDefinition(
    'Science(Chemistry)',
    'Knowledge about drugs, potions and crafting bombs',
    'TRAINED',
    false,
    justInt
  ),
  'Sleight of Hand': new SkillDefinition(
    'Sleight of Hand',
    'Fast hands, can be used to steal undetected',
    'NATURAL',
    false,
    justAgi
  ),
  Detect: new SkillDefinition(
    'Detect',
    'The capacity to spot and listen hidden stuff',
    'NATURAL',
    false,
    justEsn
  ),
  Survival: new SkillDefinition(
    'Survival',
    'Navigation, camping and find food in the wilds',
    'NATURAL',
    false,
    justInt
  ),
  Hunting: new SkillDefinition(
    'Hunting',
    'Tracking and knowledge about prey',
    'TRAINED',
    false,
    justInt
  ),
};

export const commonSkillDefinitions: ArrayView<SkillNameLiteral> =
  new ArrayView(
    Object.entries(skillDefinitions)
      .filter(([, value]) => value.category === 'NATURAL')
      .map((kv) => kv[0] as SkillNameLiteral)
  );

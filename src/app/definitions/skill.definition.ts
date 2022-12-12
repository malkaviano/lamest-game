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
  characteristics['STR'].value;

const justAgi = (characteristics: CharacteristicSetDefinition) =>
  characteristics['AGI'].value;

const justInt = (characteristics: CharacteristicSetDefinition) =>
  characteristics['INT'].value;

const justEsn = (characteristics: CharacteristicSetDefinition) =>
  characteristics['ESN'].value;

const justApp = (characteristics: CharacteristicSetDefinition) =>
  characteristics['APP'].value;

const strPlusAgi = (characteristics: CharacteristicSetDefinition) =>
  justStr(characteristics) + justAgi(characteristics);

const doubleDex = (characteristics: CharacteristicSetDefinition) =>
  justAgi(characteristics) * 2;

const intPlusEsn = (characteristics: CharacteristicSetDefinition) =>
  justInt(characteristics) + justEsn(characteristics);

export const skillDefinitions: {
  readonly [key in SkillNameLiteral]: SkillDefinition;
} = {
  Athleticism: new SkillDefinition(
    'Athleticism',
    'Swim, Jump, Climb and related',
    'NATURAL',
    false,
    strPlusAgi
  ),
  Appraise: new SkillDefinition('Appraise', '', 'NATURAL', false, justInt),
  'Artillery (Siege)': new SkillDefinition(
    'Artillery (Siege)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Artillery (War)': new SkillDefinition(
    'Artillery (War)',
    '',
    'TRAINED',
    true,
    justInt
  ),
  Bargain: new SkillDefinition('Bargain', '', 'NATURAL', false, justApp),
  Brawl: new SkillDefinition(
    'Brawl',
    'Fighting with bare hands and martial arts',
    'NATURAL',
    true,
    justStr
  ),
  'Craft (Blacksmithing)': new SkillDefinition(
    'Craft (Blacksmithing)',
    '',
    'TRAINED',
    false,
    justStr
  ),
  'Craft (Cooking)': new SkillDefinition(
    'Craft (Cooking)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Craft (Leatherworking)': new SkillDefinition(
    'Craft (Leatherworking)',
    '',
    'TRAINED',
    false,
    justAgi
  ),
  'Craft (Woodworking)': new SkillDefinition(
    'Craft (Woodworking)',
    '',
    'TRAINED',
    false,
    justStr
  ),
  'Craft (Sewing)': new SkillDefinition(
    'Craft (Sewing)',
    '',
    'TRAINED',
    false,
    justAgi
  ),
  Demolition: new SkillDefinition('Demolition', '', 'TRAINED', false, justInt),
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
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Drive (Traction)': new SkillDefinition(
    'Drive (Traction)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Drive (Heavy Vehicles)': new SkillDefinition(
    'Drive (Heavy Vehicles)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Etiquette: new SkillDefinition('Etiquette', '', 'TRAINED', false, justApp),
  'Engineering (Computer)': new SkillDefinition(
    'Engineering (Computer)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Engineering (Electrical)': new SkillDefinition(
    'Engineering (Electrical)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Engineering (Mechanical)': new SkillDefinition(
    'Engineering (Mechanical)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Firearm (Handgun)': new SkillDefinition(
    'Firearm (Handgun)',
    '',
    'NATURAL',
    true,
    justAgi
  ),
  'Firearm (Shooter)': new SkillDefinition(
    'Firearm (Shooter)',
    '',
    'TRAINED',
    true,
    justAgi
  ),
  'First Aid': new SkillDefinition('First Aid', '', 'NATURAL', false, justInt),
  Gaming: new SkillDefinition('Gaming', '', 'NATURAL', false, intPlusEsn),
  'Industrial Heavy Machinery': new SkillDefinition(
    'Industrial Heavy Machinery',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Hide: new SkillDefinition('Hide', '', 'NATURAL', false, justEsn),
  'Knowledge (Antique)': new SkillDefinition(
    'Knowledge (Antique)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (History)': new SkillDefinition(
    'Knowledge (History)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Linguistics)': new SkillDefinition(
    'Knowledge (Linguistics)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Occult)': new SkillDefinition(
    'Knowledge (Occult)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Religion)': new SkillDefinition(
    'Knowledge (Religion)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Strategy)': new SkillDefinition(
    'Knowledge (Strategy)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Melee Weapon (Simple)': new SkillDefinition(
    'Melee Weapon (Simple)',
    '',
    'NATURAL',
    true,
    justStr
  ),
  'Melee Weapon (Great)': new SkillDefinition(
    'Melee Weapon (Great)',
    '',
    'TRAINED',
    true,
    justStr
  ),
  'Ranged Weapon (Throw)': new SkillDefinition(
    'Ranged Weapon (Throw)',
    '',
    'NATURAL',
    true,
    justAgi
  ),
  'Ranged Weapon (Bow)': new SkillDefinition(
    'Ranged Weapon (Bow)',
    '',
    'TRAINED',
    true,
    justAgi
  ),
  Performance: new SkillDefinition(
    'Performance',
    '',
    'NATURAL',
    false,
    justApp
  ),
  Persuade: new SkillDefinition('Persuade', '', 'NATURAL', false, justApp),
  'Pilot (Airplane)': new SkillDefinition(
    'Pilot (Airplane)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Pilot (Boat)': new SkillDefinition(
    'Pilot (Boat)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Research: new SkillDefinition('Research', '', 'NATURAL', false, justInt),
  'Ride (Horse)': new SkillDefinition(
    'Ride (Horse)',
    '',
    'TRAINED',
    false,
    justAgi
  ),
  'Science(Botany)': new SkillDefinition(
    'Science(Botany)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Chemistry)': new SkillDefinition(
    'Science(Chemistry)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Mathematics)': new SkillDefinition(
    'Science(Mathematics)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Medicine)': new SkillDefinition(
    'Science(Medicine)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Physics)': new SkillDefinition(
    'Science(Physics)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Sleight of Hand': new SkillDefinition(
    'Sleight of Hand',
    '',
    'NATURAL',
    false,
    justAgi
  ),
  Detect: new SkillDefinition('Detect', '', 'NATURAL', false, justEsn),
  Survival: new SkillDefinition('Survival', '', 'NATURAL', false, justInt),
  Hunting: new SkillDefinition('Hunting', '', 'TRAINED', false, justInt),
};

export const commonSkillDefinitions: ArrayView<SkillNameLiteral> =
  new ArrayView(
    Object.entries(skillDefinitions)
      .filter(([, value]) => value.category === 'NATURAL')
      .map((kv) => kv[0] as SkillNameLiteral)
  );

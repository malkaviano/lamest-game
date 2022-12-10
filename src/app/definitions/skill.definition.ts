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

const justDex = (characteristics: CharacteristicSetDefinition) =>
  characteristics['DEX'].value;

const justInt = (characteristics: CharacteristicSetDefinition) =>
  characteristics['INT'].value;

const justPow = (characteristics: CharacteristicSetDefinition) =>
  characteristics['POW'].value;

const justApp = (characteristics: CharacteristicSetDefinition) =>
  characteristics['APP'].value;

const strPlusConPlusDex = (characteristics: CharacteristicSetDefinition) =>
  characteristics['STR'].value +
  characteristics['CON'].value +
  characteristics['DEX'].value;

const strPlusDex = (characteristics: CharacteristicSetDefinition) =>
  justStr(characteristics) + justDex(characteristics);

const doubleDex = (characteristics: CharacteristicSetDefinition) =>
  justDex(characteristics) * 2;

const intPlusPow = (characteristics: CharacteristicSetDefinition) =>
  justInt(characteristics) + justPow(characteristics);

export const skillDefinitions: {
  readonly [key in SkillNameLiteral]: SkillDefinition;
} = {
  Athleticism: new SkillDefinition(
    'Athleticism',
    'Swim, Jump, Climb and related',
    'COMMON',
    false,
    strPlusConPlusDex
  ),
  Appraise: new SkillDefinition('Appraise', '', 'COMMON', false, justInt),
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
  Bargain: new SkillDefinition('Bargain', '', 'COMMON', false, justApp),
  Brawl: new SkillDefinition(
    'Brawl',
    'Fighting with bare hands and martial arts',
    'COMMON',
    true,
    strPlusDex
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
    justDex
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
    justDex
  ),
  Demolition: new SkillDefinition('Demolition', '', 'TRAINED', false, justInt),
  Dodge: new SkillDefinition(
    'Dodge',
    'Ability to avoid being hit',
    'COMMON',
    true,
    doubleDex
  ),
  Disguise: new SkillDefinition('Disguise', '', 'COMMON', false, justApp),
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
    'COMMON',
    true,
    justDex
  ),
  'Firearm (Shooter)': new SkillDefinition(
    'Firearm (Shooter)',
    '',
    'TRAINED',
    true,
    justDex
  ),
  'First Aid': new SkillDefinition('First Aid', '', 'COMMON', false, justInt),
  Gaming: new SkillDefinition('Gaming', '', 'COMMON', false, intPlusPow),
  'Industrial Heavy Machinery': new SkillDefinition(
    'Industrial Heavy Machinery',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Hide: new SkillDefinition('Hide', '', 'COMMON', false, justPow),
  Insight: new SkillDefinition('Insight', '', 'COMMON', false, justPow),
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
  Listen: new SkillDefinition('Listen', '', 'COMMON', false, justPow),
  'Melee Weapon (Simple)': new SkillDefinition(
    'Melee Weapon (Simple)',
    '',
    'COMMON',
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
    'COMMON',
    true,
    justDex
  ),
  'Ranged Weapon (Bow)': new SkillDefinition(
    'Ranged Weapon (Bow)',
    '',
    'TRAINED',
    true,
    justDex
  ),
  Navigate: new SkillDefinition('Navigate', '', 'COMMON', false, justInt),
  Performance: new SkillDefinition('Performance', '', 'COMMON', false, justApp),
  Persuade: new SkillDefinition('Persuade', '', 'COMMON', false, justApp),
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
  Research: new SkillDefinition('Research', '', 'COMMON', false, justInt),
  'Ride (Horse)': new SkillDefinition(
    'Ride (Horse)',
    '',
    'TRAINED',
    false,
    justDex
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
    'COMMON',
    false,
    justDex
  ),
  Spot: new SkillDefinition('Spot', '', 'COMMON', false, justPow),
  Survival: new SkillDefinition('Survival', '', 'COMMON', false, justInt),
  Track: new SkillDefinition('Track', '', 'TRAINED', false, justInt),
};

export const commonSkillDefinitions: ArrayView<SkillNameLiteral> =
  new ArrayView(
    Object.entries(skillDefinitions)
      .filter(([, value]) => value.category === 'COMMON')
      .map((kv) => kv[0] as SkillNameLiteral)
  );

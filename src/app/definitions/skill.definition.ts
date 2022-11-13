import { SkillCategoryLiteral } from '../literals/skill-category.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ArrayView } from './array-view.definition';
import { Characteristics } from './characteristics.definition';

export class Skill {
  constructor(
    public readonly name: SkillNameLiteral,
    public readonly description: string,
    public readonly category: SkillCategoryLiteral,
    public readonly combat: boolean,
    private readonly baseGenerator: (characteristics: Characteristics) => number
  ) {}

  public base(characteristics: Characteristics): number {
    return this.baseGenerator(characteristics);
  }
}

const justStr = (characteristics: Characteristics) => characteristics.str.value;

const justDex = (characteristics: Characteristics) => characteristics.dex.value;

const justInt = (characteristics: Characteristics) => characteristics.int.value;

const justPow = (characteristics: Characteristics) => characteristics.pow.value;

const justApp = (characteristics: Characteristics) => characteristics.app.value;

const strPlusConPlusDex = (characteristics: Characteristics) =>
  characteristics.str.value +
  characteristics.con.value +
  characteristics.dex.value;

const strPlusDex = (characteristics: Characteristics) =>
  justStr(characteristics) + justDex(characteristics);

const doubleDex = (characteristics: Characteristics) =>
  justDex(characteristics) * 2;

const intPlusPow = (characteristics: Characteristics) =>
  justInt(characteristics) + justPow(characteristics);

export const skillDefinitions: { readonly [key in SkillNameLiteral]: Skill } = {
  Athleticism: new Skill(
    'Athleticism',
    'Swim, Jump, Climb and related',
    'COMMON',
    false,
    strPlusConPlusDex
  ),
  Appraise: new Skill('Appraise', '', 'COMMON', false, justInt),
  'Artillery (Siege)': new Skill(
    'Artillery (Siege)',
    '',
    'TRAINED',
    true,
    justInt
  ),
  'Artillery (War)': new Skill('Artillery (War)', '', 'TRAINED', true, justInt),
  Bargain: new Skill('Bargain', '', 'COMMON', false, justApp),
  Brawl: new Skill(
    'Brawl',
    'Fighting with bare hands and martial arts',
    'COMMON',
    true,
    strPlusDex
  ),
  'Craft (Blacksmithing)': new Skill(
    'Craft (Blacksmithing)',
    '',
    'TRAINED',
    false,
    justStr
  ),
  'Craft (Cooking)': new Skill(
    'Craft (Cooking)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Craft (Leatherworking)': new Skill(
    'Craft (Leatherworking)',
    '',
    'TRAINED',
    false,
    justDex
  ),
  'Craft (Woodworking)': new Skill(
    'Craft (Woodworking)',
    '',
    'TRAINED',
    false,
    justStr
  ),
  'Craft (Sewing)': new Skill('Craft (Sewing)', '', 'TRAINED', false, justDex),
  Demolition: new Skill('Demolition', '', 'TRAINED', false, justInt),
  Dodge: new Skill(
    'Dodge',
    'Ability to avoid being hit',
    'COMMON',
    true,
    doubleDex
  ),
  Disguise: new Skill('Disguise', '', 'COMMON', false, justApp),
  'Drive (Automobile)': new Skill(
    'Drive (Automobile)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Drive (Traction)': new Skill(
    'Drive (Traction)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Drive (Heavy Vehicles)': new Skill(
    'Drive (Heavy Vehicles)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Etiquette: new Skill('Etiquette', '', 'TRAINED', false, justApp),
  'Engineering (Computer)': new Skill(
    'Engineering (Computer)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Engineering (Electrical)': new Skill(
    'Engineering (Electrical)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Engineering (Mechanical)': new Skill(
    'Engineering (Mechanical)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Firearm (Handgun)': new Skill(
    'Firearm (Handgun)',
    '',
    'COMMON',
    true,
    justDex
  ),
  'Firearm (Shooter)': new Skill(
    'Firearm (Shooter)',
    '',
    'TRAINED',
    true,
    justDex
  ),
  'First Aid': new Skill('First Aid', '', 'COMMON', false, justInt),
  Gaming: new Skill('Gaming', '', 'COMMON', false, intPlusPow),
  'Industrial Heavy Machinery': new Skill(
    'Industrial Heavy Machinery',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Hide: new Skill('Hide', '', 'COMMON', false, justPow),
  Insight: new Skill('Insight', '', 'COMMON', false, justPow),
  'Knowledge (Antique)': new Skill(
    'Knowledge (Antique)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (History)': new Skill(
    'Knowledge (History)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Linguistics)': new Skill(
    'Knowledge (Linguistics)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Occult)': new Skill(
    'Knowledge (Occult)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Religion)': new Skill(
    'Knowledge (Religion)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Knowledge (Strategy)': new Skill(
    'Knowledge (Strategy)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  Listen: new Skill('Listen', '', 'COMMON', false, justPow),
  'Melee Weapon (Simple)': new Skill(
    'Melee Weapon (Simple)',
    '',
    'COMMON',
    true,
    justStr
  ),
  'Melee Weapon (Exotic)': new Skill(
    'Melee Weapon (Exotic)',
    '',
    'TRAINED',
    true,
    justStr
  ),
  'Missile Weapon (Throw)': new Skill(
    'Missile Weapon (Throw)',
    '',
    'COMMON',
    true,
    justDex
  ),
  'Missile Weapon (String)': new Skill(
    'Missile Weapon (String)',
    '',
    'TRAINED',
    true,
    justDex
  ),
  Navigate: new Skill('Navigate', '', 'COMMON', false, justInt),
  Performance: new Skill('Performance', '', 'COMMON', false, justApp),
  Persuade: new Skill('Persuade', '', 'COMMON', false, justApp),
  'Pilot (Airplane)': new Skill(
    'Pilot (Airplane)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Pilot (Boat)': new Skill('Pilot (Boat)', '', 'TRAINED', false, justInt),
  Research: new Skill('Research', '', 'COMMON', false, justInt),
  'Ride (Horse)': new Skill('Ride (Horse)', '', 'TRAINED', false, justDex),
  'Science(Botany)': new Skill(
    'Science(Botany)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Chemistry)': new Skill(
    'Science(Chemistry)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Mathematics)': new Skill(
    'Science(Mathematics)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Medicine)': new Skill(
    'Science(Medicine)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Science(Physics)': new Skill(
    'Science(Physics)',
    '',
    'TRAINED',
    false,
    justInt
  ),
  'Sleight of Hand': new Skill('Sleight of Hand', '', 'COMMON', false, justDex),
  Spot: new Skill('Spot', '', 'COMMON', false, justPow),
  Stealth: new Skill('Stealth', '', 'COMMON', false, justDex),
  Survival: new Skill('Survival', '', 'COMMON', false, justInt),
  Throw: new Skill('Throw', '', 'COMMON', false, justDex),
  Track: new Skill('Track', '', 'TRAINED', false, justInt),
};

export const commonSkillDefinitions: ArrayView<SkillNameLiteral> =
  new ArrayView(
    Object.entries(skillDefinitions)
      .filter(([_, value]) => value.category === 'COMMON')
      .map((kv) => kv[0] as SkillNameLiteral)
  );

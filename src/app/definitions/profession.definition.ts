import { ProfessionLiteral } from '../literals/profession.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ArrayView } from './array-view.definition';

export const professions: ArrayView<ProfessionLiteral> = new ArrayView([
  'Police Detective',
  'Private investigator',
  'Hunter',
  'Mercenary',
  'Doctor',
  'Fisherman',
  'Vagabond',
  'Scholar',
]);

const doctor: ArrayView<SkillNameLiteral> = new ArrayView([
  'First Aid',
  'Science(Medicine)',
  'Persuade',
  'Research',
  'Spot',
  'Insight',
  'Sleight of Hand',
  'Knowledge (Linguistics)',
  'Craft (Sewing)',
  'Etiquette',
]);

const policeDetective: ArrayView<SkillNameLiteral> = new ArrayView([
  'Firearm (Handgun)',
  'First Aid',
  'Listen',
  'Persuade',
  'Spot',
  'Research',
  'Drive (Automobile)',
  'Firearm (Shooter)',
  'Brawl',
  'Dodge',
]);

const privateInvestigator: ArrayView<SkillNameLiteral> = new ArrayView([
  'Firearm (Handgun)',
  'First Aid',
  'Listen',
  'Persuade',
  'Spot',
  'Research',
  'Drive (Automobile)',
  'Stealth',
  'Engineering (Computer)',
  'Disguise',
]);

const hunter: ArrayView<SkillNameLiteral> = new ArrayView([
  'Navigate',
  'Athleticism',
  'Hide',
  'Listen',
  'Spot',
  'Stealth',
  'Track',
  'Survival',
  'Firearm (Shooter)',
  'Melee Weapon (Simple)',
]);

const mercenary: ArrayView<SkillNameLiteral> = new ArrayView([
  'Brawl',
  'Athleticism',
  'Dodge',
  'First Aid',
  'Knowledge (Strategy)',
  'Firearm (Shooter)',
  'Demolition',
  'Engineering (Electrical)',
  'Artillery (War)',
  'Survival',
]);

const fisherman: ArrayView<SkillNameLiteral> = new ArrayView([
  'Athleticism',
  'Craft (Cooking)',
  'Dodge',
  'Navigate',
  'Pilot (Boat)',
  'Listen',
  'Spot',
  'Engineering (Mechanical)',
  'Melee Weapon (Simple)',
  'Survival',
]);

const vagabond: ArrayView<SkillNameLiteral> = new ArrayView([
  'Stealth',
  'Firearm (Handgun)',
  'Dodge',
  'Melee Weapon (Simple)',
  'Listen',
  'Spot',
  'Performance',
  'Persuade',
  'Sleight of Hand',
  'Hide',
]);

const scholar: ArrayView<SkillNameLiteral> = new ArrayView([
  'First Aid',
  'Insight',
  'Research',
  'Listen',
  'Persuade',
  'Etiquette',
  'Knowledge (History)',
  'Knowledge (Occult)',
  'Knowledge (Linguistics)',
  'Knowledge (Religion)',
]);

export const professionSkillDefinitions: {
  [key in ProfessionLiteral]: ArrayView<SkillNameLiteral>;
} = {
  'Police Detective': policeDetective,
  'Private investigator': privateInvestigator,
  Hunter: hunter,
  Mercenary: mercenary,
  Doctor: doctor,
  Fisherman: fisherman,
  Vagabond: vagabond,
  Scholar: scholar,
};

import { ProfessionLiteral } from '../literals/profession.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ArrayView } from '../views/array.view';

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
  'Science(Chemistry)',
  'Manipulation',
  'Research',
  'Detect',
  'Science(Botany)',
  'Sleight of Hand',
  'Knowledge (Linguistics)',
  'Craft (Sewing)',
  'Etiquette',
]);

const policeDetective: ArrayView<SkillNameLiteral> = new ArrayView([
  'Firearm (Handgun)',
  'First Aid',
  'Detect',
  'Manipulation',
  'Etiquette',
  'Research',
  'Drive (Automobile)',
  'Firearm (Shooter)',
  'Brawl',
  'Dodge',
]);

const privateInvestigator: ArrayView<SkillNameLiteral> = new ArrayView([
  'Firearm (Handgun)',
  'First Aid',
  'Detect',
  'Manipulation',
  'Streetwise',
  'Research',
  'Drive (Automobile)',
  'Hide',
  'Engineering (Computer)',
  'Disguise',
]);

const hunter: ArrayView<SkillNameLiteral> = new ArrayView([
  'Craft (Cooking)',
  'Athleticism',
  'Hide',
  'Detect',
  'Ranged Weapon (Throw)',
  'Craft (Leatherworking)',
  'Hunting',
  'Survival',
  'Firearm (Shooter)',
  'Melee Weapon (Simple)',
]);

const mercenary: ArrayView<SkillNameLiteral> = new ArrayView([
  'Brawl',
  'Athleticism',
  'Dodge',
  'First Aid',
  'Drive (Heavy Vehicles)',
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
  'Ranged Weapon (Throw)',
  'Pilot (Boat)',
  'Detect',
  'Hide',
  'Engineering (Mechanical)',
  'Melee Weapon (Simple)',
  'Survival',
]);

const vagabond: ArrayView<SkillNameLiteral> = new ArrayView([
  'Firearm (Handgun)',
  'Dodge',
  'Melee Weapon (Simple)',
  'Detect',
  'Streetwise',
  'Performance',
  'Manipulation',
  'Sleight of Hand',
  'Hide',
  'Ranged Weapon (Throw)',
]);

const scholar: ArrayView<SkillNameLiteral> = new ArrayView([
  'First Aid',
  'Detect',
  'Research',
  'Appraise',
  'Manipulation',
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

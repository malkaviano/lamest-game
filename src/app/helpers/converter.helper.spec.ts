import { ArrayView } from '../views/array.view';
import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacterValuesDefinition } from '../definitions/character-values.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';
import { KeyValueDescriptionDefinition } from '../definitions/key-value-description.definition';
import { CharacterEntity } from '../entities/character.entity';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ConverterHelper } from './converter.helper';

describe('ConverterHelper', () => {
  describe('converting a character to keyValues', () => {
    it('return keyvalue array', () => {
      const result = helper.characterToKeyValueDescription(character);

      expect(result).toEqual(expected);
    });
  });
});

const helper = new ConverterHelper();

const character = new CharacterEntity(
  new IdentityDefinition(
    'name',
    'Hunter',
    'FEMALE',
    'ADULT',
    'HUMAN',
    'AVERAGE',
    'AVERAGE'
  ),
  new CharacteristicsDefinition(
    new CharacteristicDefinition('STR', 12),
    new CharacteristicDefinition('CON', 12),
    new CharacteristicDefinition('SIZ', 12),
    new CharacteristicDefinition('DEX', 12),
    new CharacteristicDefinition('INT', 12),
    new CharacteristicDefinition('POW', 12),
    new CharacteristicDefinition('APP', 12)
  ),
  new Map<SkillNameLiteral, number>([
    ['Firearm (Handgun)', 50],
    ['First Aid', 35],
    ['Listen', 20],
    ['Persuade', 60],
    ['Spot', 40],
    ['Research', 35],
  ])
);

const expected = new CharacterValuesDefinition(
  new ArrayView([
    new KeyValueDescriptionDefinition('NAME', 'name', 'Character name'),
    new KeyValueDescriptionDefinition(
      'PROFESSION',
      'Hunter',
      'Character profession'
    ),
    new KeyValueDescriptionDefinition('GENDER', 'FEMALE', 'Character gender'),
    new KeyValueDescriptionDefinition('AGE', 'ADULT', 'Character age'),
    new KeyValueDescriptionDefinition('RACE', 'HUMAN', 'Character race'),
    new KeyValueDescriptionDefinition('HEIGHT', 'AVERAGE', 'Character height'),
    new KeyValueDescriptionDefinition('WEIGHT', 'AVERAGE', 'Character weight'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition(
      'STR',
      '12',
      'The character physical force'
    ),
    new KeyValueDescriptionDefinition(
      'CON',
      '12',
      'The character body constitution'
    ),
    new KeyValueDescriptionDefinition('SIZ', '12', 'The character body shape'),
    new KeyValueDescriptionDefinition('DEX', '12', 'The character agility'),
    new KeyValueDescriptionDefinition(
      'INT',
      '12',
      'The character intelligence'
    ),
    new KeyValueDescriptionDefinition(
      'POW',
      '12',
      'The character mental strength'
    ),
    new KeyValueDescriptionDefinition('APP', '12', 'The character looks'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('HP', '12', 'The character hit points'),
    new KeyValueDescriptionDefinition('PP', '12', 'The character power points'),
    new KeyValueDescriptionDefinition('MOV', '10', 'The character movement'),
  ]),
  new ArrayView([
    new KeyValueDescriptionDefinition('Firearm (Handgun)', '62', ''),
    new KeyValueDescriptionDefinition('First Aid', '47', ''),
    new KeyValueDescriptionDefinition('Listen', '32', ''),
    new KeyValueDescriptionDefinition('Persuade', '72', ''),
    new KeyValueDescriptionDefinition('Spot', '52', ''),
    new KeyValueDescriptionDefinition('Research', '47', ''),
  ])
);

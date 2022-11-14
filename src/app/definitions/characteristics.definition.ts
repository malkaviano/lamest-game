import { CharacteristicNameLiteral } from '../literals/characteristic-name.literal';
import { CharacteristicDefinition } from './characteristic.definition';

export class CharacteristicsDefinition {
  constructor(
    public readonly str: CharacteristicDefinition,
    public readonly con: CharacteristicDefinition,
    public readonly siz: CharacteristicDefinition,
    public readonly dex: CharacteristicDefinition,
    public readonly int: CharacteristicDefinition,
    public readonly pow: CharacteristicDefinition,
    public readonly app: CharacteristicDefinition
  ) {}
}

export const characteristicsDefinitions: {
  [key in CharacteristicNameLiteral]: string;
} = {
  STR: 'The character physical force',
  CON: 'The character body constitution',
  DEX: 'The character agility',
  SIZ: 'The character body shape',
  INT: 'The character intelligence',
  POW: 'The character mental strength',
  APP: 'The character looks',
};

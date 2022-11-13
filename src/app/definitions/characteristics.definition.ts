import { CharacteristicNameLiteral } from '../literals/characteristic-name.literal';
import { Characteristic } from './characteristic.definition';

export class Characteristics {
  constructor(
    public readonly str: Characteristic,
    public readonly con: Characteristic,
    public readonly siz: Characteristic,
    public readonly dex: Characteristic,
    public readonly int: Characteristic,
    public readonly pow: Characteristic,
    public readonly app: Characteristic
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

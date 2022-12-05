import { CharacteristicNameLiteral } from '../literals/characteristic-name.literal';

export class CharacteristicDefinition {
  constructor(
    public readonly key: CharacteristicNameLiteral,
    public readonly value: number
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

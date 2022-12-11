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
  VIT: 'The character vitality',
  AGI: 'The character agility',
  INT: 'The character intelligence',
  ESN: 'The character essence',
  APP: 'The character looks',
};

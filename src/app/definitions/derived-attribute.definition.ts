import { DerivedAttributeNameLiteral } from '../literals/derived-attribute-name.literal';

export class DerivedAttributeDefinition {
  constructor(
    public readonly key: DerivedAttributeNameLiteral,
    public readonly value: number
  ) {}
}

export const derivedAttributeDefinitions: {
  [key in DerivedAttributeNameLiteral]: string;
} = {
  HP: 'The character hit points',
  EP: 'The character energy points',
  MOV: 'The character movement',
};

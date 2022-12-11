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
  EP: 'The character essence points',
  MOV: 'The character movement',
};

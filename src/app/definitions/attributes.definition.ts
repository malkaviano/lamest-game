import { AttributeNameLiteral } from '../literals/attribute-name.literal';
import { DerivedAttributeDefinition } from './attribute.definition';

export class DerivedAttributesDefinition {
  constructor(
    public readonly hp: DerivedAttributeDefinition,
    public readonly pp: DerivedAttributeDefinition,
    public readonly mov: DerivedAttributeDefinition
  ) {}
}

export const derivedAttributeDefinitions: {
  [key in AttributeNameLiteral]: string;
} = {
  HP: 'The character hit points',
  PP: 'The character power points',
  MOV: 'The character movement',
};

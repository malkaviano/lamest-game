import { AttributeNameLiteral } from '../literals/attribute-name.literal';
import { DerivedAttribute } from './attribute.definition';

export class DerivedAttributes {
  constructor(
    public readonly hp: DerivedAttribute,
    public readonly pp: DerivedAttribute,
    public readonly mov: DerivedAttribute
  ) {}
}

export const derivedAttributeDefinitions: {
  [key in AttributeNameLiteral]: string;
} = {
  HP: 'The character hit points',
  PP: 'The character power points',
  MOV: 'The character movement',
};

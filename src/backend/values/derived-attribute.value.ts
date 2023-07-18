import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { DerivedAttributeNameLiteral } from '@literals/derived-attribute-name.literal';

export type DerivedAttributeValues = {
  readonly [key in DerivedAttributeNameLiteral]: DerivedAttributeDefinition;
};

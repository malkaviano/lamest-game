import { DerivedAttributeDefinition } from './derived-attribute.definition';
import { DerivedAttributeNameLiteral } from '@literals/derived-attribute-name.literal';

export type DerivedAttributeSetDefinition = {
  readonly [key in DerivedAttributeNameLiteral]: DerivedAttributeDefinition;
};

import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';

export interface WithDerivedAttibutesInterface {
  get derivedAttributes(): DerivedAttributeSetDefinition;
}

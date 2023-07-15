import { DerivedAttributeSetDefinition } from '@definitions/derived-attribute-set.definition';

export interface WithDerivedAttributesInterface {
  get derivedAttributes(): DerivedAttributeSetDefinition;

  apSpent(apSpent: number): void;

  apRecovered(apRecovered: number): void;
}

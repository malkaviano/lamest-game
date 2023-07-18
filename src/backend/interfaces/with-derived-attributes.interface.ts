import { DerivedAttributeValues } from '@values/derived-attribute.value';

export interface WithDerivedAttributesInterface {
  get derivedAttributes(): DerivedAttributeValues;

  apSpent(apSpent: number): void;

  apRecovered(apRecovered: number): void;
}

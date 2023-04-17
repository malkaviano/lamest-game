import { DerivedAttributeNameLiteral } from '../literals/derived-attribute-name.literal';

export class DerivedAttributeDefinition {
  constructor(
    public readonly key: DerivedAttributeNameLiteral,
    public readonly value: number
  ) {}
}

import { AttributeNameLiteral } from '../literals/attribute-name.literal';

export class DerivedAttributeDefinition {
  constructor(
    public readonly key: AttributeNameLiteral,
    public readonly value: number
  ) {}
}

import { AttributeNameLiteral } from '../literals/attribute-name.literal';

export class DerivedAttribute {
  constructor(
    public readonly key: AttributeNameLiteral,
    public readonly value: number,
    public readonly description: string
  ) {}
}

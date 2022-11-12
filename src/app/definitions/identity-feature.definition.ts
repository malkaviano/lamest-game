import { IdentityLiteral } from '../literals/identity.literal';

export class IdentityFeature {
  constructor(
    public readonly key: IdentityLiteral,
    public readonly value: string,
    public readonly description: string
  ) {}
}

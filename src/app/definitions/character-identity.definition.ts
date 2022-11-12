import { IdentityFeature } from './identity-feature.definition';

export class CharacterIdentity {
  constructor(
    public readonly name: IdentityFeature,
    public readonly profession: IdentityFeature,
    public readonly gender: IdentityFeature,
    public readonly age: IdentityFeature,
    public readonly race: IdentityFeature,
    public readonly height: IdentityFeature,
    public readonly weight: IdentityFeature
  ) {}
}

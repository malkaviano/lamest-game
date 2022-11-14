import { DerivedAttributesDefinition } from '../definitions/attributes.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacteristicsDefinition } from '../definitions/characteristics.definition';

export class CharacterEntity {
  constructor(
    public readonly identity: CharacterIdentityDefinition,
    public readonly characteristics: CharacteristicsDefinition,
    public readonly derivedAttributes: DerivedAttributesDefinition,
    public readonly skills: KeyValueInterface
  ) {}
}

import { DerivedAttributesDefinition } from './attributes.definition';
import { CharacterIdentityDefinition } from './character-identity.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacteristicsDefinition } from './characteristics.definition';

export class CharacterDefinition {
  constructor(
    public readonly identity: CharacterIdentityDefinition,
    public readonly characteristics: CharacteristicsDefinition,
    public readonly derivedAttributes: DerivedAttributesDefinition,
    public readonly skills: KeyValueInterface
  ) {}
}

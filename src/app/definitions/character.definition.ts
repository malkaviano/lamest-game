import { DerivedAttributes } from './attributes.definition';
import { CharacterIdentity } from './character-identity.definition';
import { CharacterSkills } from './character-skills.definition';
import { Characteristics } from './characteristics.definition';

export class Character {
  constructor(
    public readonly identity: CharacterIdentity,
    public readonly characteristics: Characteristics,
    public readonly derivedAttributes: DerivedAttributes,
    public readonly skills: CharacterSkills
  ) {}
}

import { Injectable } from '@angular/core';

import { ArrayView } from '../views/array.view';
import { DerivedAttributeDefinition } from '../definitions/attribute.definition';
import { derivedAttributeDefinitions } from '../definitions/attributes.definition';
import { characterIdentityDefinitions } from '../definitions/identity.definition';
import { CharacterValuesDefinition } from '../definitions/character-values.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { characteristicsDefinitions } from '../definitions/characteristics.definition';
import { KeyValueDescriptionDefinition } from '../definitions/key-value-description.definition';
import { skillDefinitions } from '../definitions/skill.definition';
import { CharacterEntity } from '../entities/character.entity';
import { IdentityLiteral } from '../literals/identity.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';

@Injectable({
  providedIn: 'root',
})
export class ConverterHelper {
  public characterToKeyValueDescription(
    character: CharacterEntity
  ): CharacterValuesDefinition {
    const identity = new ArrayView(
      Object.entries(character.identity).map(([key, value]) => {
        return new KeyValueDescriptionDefinition(
          key.toUpperCase(),
          value,
          characterIdentityDefinitions[key as IdentityLiteral]
        );
      })
    );

    const characteristics = new ArrayView(
      Object.values(character.characteristics).map(
        (c: CharacteristicDefinition) => {
          return new KeyValueDescriptionDefinition(
            c.key,
            c.value.toString(),
            characteristicsDefinitions[c.key]
          );
        }
      )
    );

    const derivedAttributes = new ArrayView(
      Object.values(character.derivedAttributes).map(
        (da: DerivedAttributeDefinition) => {
          return new KeyValueDescriptionDefinition(
            da.key,
            da.value.toString(),
            derivedAttributeDefinitions[da.key]
          );
        }
      )
    );

    const skills = new ArrayView(
      Object.entries(character.skills).map(([key, value]) => {
        return new KeyValueDescriptionDefinition(
          key,
          value.toString(),
          skillDefinitions[key as SkillNameLiteral].description
        );
      })
    );

    return new CharacterValuesDefinition(
      identity,
      characteristics,
      derivedAttributes,
      skills
    );
  }
}

import { Injectable } from '@angular/core';

import { ArrayView } from '../views/array.view';
import {
  DerivedAttributeDefinition,
  derivedAttributeDefinitions,
} from '../definitions/derived-attribute.definition';
import { characterIdentityDefinitions } from '../definitions/character-identity.definition';
import { CharacterValuesDefinition } from '../definitions/character-values.definition';
import {
  CharacteristicDefinition,
  characteristicsDefinitions,
} from '../definitions/characteristic.definition';
import { KeyValueDescriptionDefinition } from '../definitions/key-value-description.definition';
import { skillDefinitions } from '../definitions/skill.definition';
import { PlayerEntity } from '../entities/player.entity';
import { IdentityLiteral } from '../literals/identity.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { KeyValueInterface } from '../interfaces/key-value.interface';

@Injectable({
  providedIn: 'root',
})
export class ConverterHelper {
  public characterToKeyValueDescription(
    character: PlayerEntity
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
      Object.entries(character.skills)
        .map(([key, value]) => {
          return new KeyValueDescriptionDefinition(
            key,
            value.toString(),
            skillDefinitions[key as SkillNameLiteral].description
          );
        })
        .sort((a, b) => (a.key < b.key ? -1 : 1))
    );

    return new CharacterValuesDefinition(
      identity,
      characteristics,
      derivedAttributes,
      skills
    );
  }

  public mapToKeyValueInterface<Value>(
    obj: Map<string, Value>
  ): KeyValueInterface<Value> {
    return Array.from(obj.entries()).reduce(
      (acc: { [key: string]: Value }, [k, v]) => {
        acc[k] = v;

        return acc;
      },
      {}
    );
  }
}

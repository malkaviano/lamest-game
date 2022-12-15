import { Injectable } from '@angular/core';

import { ArrayView } from '../views/array.view';
import {
  DerivedAttributeDefinition,
  derivedAttributeDefinitions,
} from '../definitions/derived-attribute.definition';
import { characterIdentityDefinitions } from '../definitions/character-identity.definition';
import { CharacterValuesView } from '../views/character-values.view';
import {
  CharacteristicDefinition,
  characteristicsDefinitions,
} from '../definitions/characteristic.definition';
import { KeyValueDescriptionView } from '../views/key-value-description.view';
import { PlayerEntity } from '../entities/player.entity';
import { CharacterIdentityLiteral } from '../literals/character-identity.literal';
import { SkillStore } from '../stores/skill.store';

@Injectable({
  providedIn: 'root',
})
export class FormatterHelperService {
  constructor(private readonly skillStore: SkillStore) {}

  public characterToKeyValueDescription(
    character: PlayerEntity
  ): CharacterValuesView {
    const identity = ArrayView.create(
      Object.entries(character.identity).map(([key, value]) => {
        return new KeyValueDescriptionView(
          key.toUpperCase(),
          value,
          characterIdentityDefinitions[key as CharacterIdentityLiteral]
        );
      })
    );

    const characteristics = ArrayView.create(
      Object.values(character.characteristics).map(
        (c: CharacteristicDefinition) => {
          return new KeyValueDescriptionView(
            c.key,
            c.value.toString(),
            characteristicsDefinitions[c.key]
          );
        }
      )
    );

    const derivedAttributes = ArrayView.create(
      Object.values(character.derivedAttributes).map(
        (da: DerivedAttributeDefinition) => {
          return new KeyValueDescriptionView(
            da.key,
            da.value.toString(),
            derivedAttributeDefinitions[da.key]
          );
        }
      )
    );

    const skills = ArrayView.create(
      Object.entries(character.skills)
        .map(([key, value]) => {
          return new KeyValueDescriptionView(
            key,
            value.toString(),
            this.skillStore.skills[key].description
          );
        })
        .sort((a, b) => (a.key < b.key ? -1 : 1))
    );

    return new CharacterValuesView(
      identity,
      characteristics,
      derivedAttributes,
      skills
    );
  }
}

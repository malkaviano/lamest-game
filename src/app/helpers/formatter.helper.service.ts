import { Injectable } from '@angular/core';

import { ArrayView } from '../model-views/array.view';
import {
  DerivedAttributeDefinition,
  derivedAttributeDefinitions,
} from '../definitions/derived-attribute.definition';
import { CharacterValuesView } from '../model-views/character-values.view';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { KeyValueDescriptionView } from '../model-views/key-value-description.view';
import { PlayerEntity } from '../entities/player.entity';
import { CharacterIdentityLiteral } from '../literals/character-identity.literal';

import { SkillStore } from '../stores/skill.store';
import { GameStringsStore } from '../stores/game-strings.store';

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
        return KeyValueDescriptionView.create(
          key.toUpperCase(),
          value,
          GameStringsStore.descriptions[key as CharacterIdentityLiteral]
        );
      })
    );

    const characteristics = ArrayView.create(
      Object.values(character.characteristics).map(
        (c: CharacteristicDefinition) => {
          return KeyValueDescriptionView.create(
            c.key,
            c.value.toString(),
            GameStringsStore.descriptions[c.key]
          );
        }
      )
    );

    const derivedAttributes = ArrayView.create(
      Object.values(character.derivedAttributes).map(
        (da: DerivedAttributeDefinition) => {
          return KeyValueDescriptionView.create(
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
          return KeyValueDescriptionView.create(
            key,
            value.toString(),
            this.skillStore.skills[key].description
          );
        })
        .sort((a, b) => (a.key < b.key ? -1 : 1))
    );

    return CharacterValuesView.create(
      identity,
      characteristics,
      derivedAttributes,
      skills
    );
  }
}

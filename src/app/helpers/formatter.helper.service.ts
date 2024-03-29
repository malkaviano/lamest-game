import { Injectable } from '@angular/core';

import { ArrayView } from '@wrappers/array.view';
import { DerivedAttributeDefinition } from '@definitions/derived-attribute.definition';
import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { CharacterIdentityLiteral } from '@literals/character-identity.literal';
import { CharacterValuesView } from '../view-models/character-values.view';
import { KeyValueDescriptionView } from '../view-models/key-value-description.view';
import { PlayerInterface } from '@interfaces/player.interface';
import { SkillStore } from '@stores/skill.store';
import { GameStringsStore } from '@stores/game-strings.store';

@Injectable({
  providedIn: 'root',
})
export class FormatterHelperService {
  constructor(private readonly skillStore: SkillStore) {}

  public characterToKeyValueDescription(
    character: PlayerInterface
  ): CharacterValuesView {
    const identity = ArrayView.fromArray(
      Object.entries(character.identity).map(([key, value]) => {
        return KeyValueDescriptionView.create(
          key.toUpperCase(),
          value,
          GameStringsStore.descriptions[key as CharacterIdentityLiteral]
        );
      })
    );

    const characteristics = ArrayView.fromArray(
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

    const derivedAttributes = ArrayView.fromArray(
      Object.values(character.derivedAttributes).map(
        (da: DerivedAttributeDefinition) => {
          return KeyValueDescriptionView.create(
            da.key,
            da.value.toString(),
            GameStringsStore.descriptions[da.key]
          );
        }
      )
    );

    const skills = ArrayView.fromArray(
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

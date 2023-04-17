import { Injectable } from '@angular/core';

import { ArrayView } from '../../core/view-models/array.view';
import { DerivedAttributeDefinition } from '../../core/definitions/derived-attribute.definition';
import { CharacteristicDefinition } from '../../core/definitions/characteristic.definition';
import { CharacterIdentityLiteral } from '../../core/literals/character-identity.literal';
import { SkillStore } from '../stores/skill.store';
import { GameStringsStore } from '../stores/game-strings.store';
import { CharacterValuesView } from '../../core/view-models/character-values.view';
import { KeyValueDescriptionView } from '../../core/view-models/key-value-description.view';
import { PlayerInterface } from '../../core/interfaces/player.interface';

@Injectable({
  providedIn: 'root',
})
export class FormatterHelperService {
  constructor(private readonly skillStore: SkillStore) {}

  public characterToKeyValueDescription(
    character: PlayerInterface
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
            GameStringsStore.descriptions[da.key]
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

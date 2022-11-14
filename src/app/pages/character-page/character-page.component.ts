import { Component, OnInit } from '@angular/core';

import { ArrayView } from '../../definitions/array-view.definition';
import { DerivedAttributeDefinition } from '../../definitions/attribute.definition';
import { derivedAttributeDefinitions } from '../../definitions/attributes.definition';
import { characterIdentityDefinitions } from '../../definitions/character-identity.definition';
import { CharacteristicDefinition } from '../../definitions/characteristic.definition';
import { characteristicsDefinitions } from '../../definitions/characteristics.definition';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';
import { skillDefinitions } from '../../definitions/skill.definition';
import { IdentityLiteral } from '../../literals/identity.literal';
import { SkillNameLiteral } from '../../literals/skill-name.literal';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css'],
})
export class CharacterPageComponent implements OnInit {
  public identityView!: ArrayView<KeyValueDescriptionDefinition>;
  public characteristicsView!: ArrayView<KeyValueDescriptionDefinition>;
  public derivedAttributesView!: ArrayView<KeyValueDescriptionDefinition>;
  public skillsView!: ArrayView<KeyValueDescriptionDefinition>;

  constructor(private readonly characterService: CharacterService) {}

  ngOnInit(): void {
    const character = this.characterService.character();

    this.identityView = new ArrayView(
      Object.entries(character.identity).map(([key, value]) => {
        return new KeyValueDescriptionDefinition(
          key.toUpperCase(),
          value,
          characterIdentityDefinitions[key as IdentityLiteral]
        );
      })
    );

    this.characteristicsView = new ArrayView(
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

    this.derivedAttributesView = new ArrayView(
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

    this.skillsView = new ArrayView(
      Object.entries(character.skills).map(([key, value]) => {
        return new KeyValueDescriptionDefinition(
          key,
          value.toString(),
          skillDefinitions[key as SkillNameLiteral].description
        );
      })
    );
  }
}

import { Component, OnInit } from '@angular/core';

import { ArrayView } from '../../definitions/array-view.definition';
import { DerivedAttribute } from '../../definitions/attribute.definition';
import { derivedAttributeDefinitions } from '../../definitions/attributes.definition';
import { characterIdentityDefinitions } from '../../definitions/character-identity.definition';
import { Characteristic } from '../../definitions/characteristic.definition';
import { characteristicsDefinitions } from '../../definitions/characteristics.definition';
import { KeyValueDescription } from '../../definitions/key-value-description.definition';
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
  public identityView!: ArrayView<KeyValueDescription>;
  public characteristicsView!: ArrayView<KeyValueDescription>;
  public derivedAttributesView!: ArrayView<KeyValueDescription>;
  public skillsView!: ArrayView<KeyValueDescription>;

  constructor(private readonly characterService: CharacterService) {}

  ngOnInit(): void {
    const identity = this.characterService.identity();

    this.identityView = new ArrayView(
      Object.entries(identity).map(([key, value]) => {
        return new KeyValueDescription(
          key.toUpperCase(),
          value,
          characterIdentityDefinitions[key as IdentityLiteral]
        );
      })
    );

    const characteristics = this.characterService.characteristics();

    this.characteristicsView = new ArrayView(
      Object.values(characteristics).map((c: Characteristic) => {
        return new KeyValueDescription(
          c.key,
          c.value.toString(),
          characteristicsDefinitions[c.key]
        );
      })
    );

    const derivedAttributes = this.characterService.attributes(characteristics);

    this.derivedAttributesView = new ArrayView(
      Object.values(derivedAttributes).map((da: DerivedAttribute) => {
        return new KeyValueDescription(
          da.key,
          da.value.toString(),
          derivedAttributeDefinitions[da.key]
        );
      })
    );

    const skills = this.characterService.skills(identity, characteristics);

    this.skillsView = new ArrayView(
      Object.entries(skills).map(([key, value]) => {
        return new KeyValueDescription(
          key,
          value.toString(),
          skillDefinitions[key as SkillNameLiteral].description
        );
      })
    );
  }
}
